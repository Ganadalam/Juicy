// Dashboard.tsx
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";

import Loader from "../components/common/Loader";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";

const CATEGORIES = ["와인", "음료", "디저트"] as const;

function shortenName(name: string): string {
  if (!name) return "이름 없음";
  return name.length <= 20 ? name : name.slice(0, 18) + "…";
}

function getDescription(category: string): string {
  switch (category) {
    case "와인":
      return "칼로리(kcal/100g) 기준 추천 점수";
    case "음료":
      return "Alcoholic / Non-Alcoholic 비율";
    case "디저트":
      return "당분(g/100g) 기준 분포";
    default:
      return "데이터 시각화";
  }
}

export default function Dashboard() {
  const [category, setCategory] = useRecoilState(selectedCategoryState);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (category === "와인") {
          const res = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=wine&json=true&page_size=15`
          );
          const json = await res.json();
          setData(
            json.products
              .map((p: any) => ({
                name: p.product_name || "Wine",
                calories: Number(p.nutriments?.["energy-kcal_100g"] ?? 0),
              }))
              .filter((d: any) => !isNaN(d.calories))
              .sort((a: any, b: any) => b.calories - a.calories)
          );
        } else if (category === "음료") {
          const res = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=Margarita`
          );
          const json = await res.json();
          setData(
            json.drinks.map((d: any) => ({
              name: d.strDrink,
              alcohol: d.strAlcoholic,
            }))
          );
        } else if (category === "디저트") {
          const res = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=dessert&json=true&page_size=15`
          );
          const json = await res.json();
          setData(
            json.products
              .map((p: any, idx: number) => ({
                name: p.product_name || `Dessert ${idx + 1}`,
                sugar: Number(p.nutriments?.["sugars_100g"] ?? 0),
              }))
              .filter((d: any) => !isNaN(d.sugar))
              .sort((a: any, b: any) => b.sugar - a.sugar)
          );
        }
      } catch (err) {
        console.error("API Error:", err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [category]);

  return (
    <main style={{ padding: "32px", background: "#f0f2f5", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1200, width: "100%" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "16px 20px", borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>추천 결과 Dashboard</h2>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSelectedSubCategory(null); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer", fontSize: "1em", background: "#f8f9fa" }}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </header>

        {isLoading && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Loader label="추천 데이터를 불러오는 중..." />
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <section style={{ marginTop: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24, overflowX: "auto" }}>
            <h3 style={{ marginBottom: 12, fontWeight: 500 }}>{category} 데이터 시각화</h3>
            <p style={{ marginBottom: 16, color: "#666", fontSize: "0.9em" }}>{getDescription(category)}</p>

            {category === "와인" && (
              <>
                <BarChart data={data.map((item: any) => ({ name: shortenName(item.name), score: item.calories }))} />
                <DataTable headers={["이름", "칼로리"]} rows={data.map((d) => [shortenName(d.name), d.calories])} />
              </>
            )}

            {category === "음료" && (
              <>
                <PieChart
                  data={[
                    { name: "Alcoholic", value: data.filter((d) => d.alcohol === "Alcoholic").length },
                    { name: "Non-Alcoholic", value: data.filter((d) => d.alcohol !== "Alcoholic").length },
                  ]}
                  onSliceClick={(name) => setSelectedSubCategory(name)}
                />
                <DataTable
                  headers={["이름", "Alcoholic 여부"]}
                  rows={data
                    .filter((d) =>
                      selectedSubCategory === "Alcoholic"
                        ? d.alcohol === "Alcoholic"
                        : selectedSubCategory === "Non-Alcoholic"
                        ? d.alcohol !== "Alcoholic"
                        : true
                    )
                    .map((d) => [d.name, d.alcohol])}
                />
              </>
            )}

            {category === "디저트" && (
              <>
                <LineChart data={data.map((item: any) => ({ name: shortenName(item.name), value: item.sugar }))} />
                <DataTable headers={["이름", "당분(g/100g)"]} rows={data.map((d) => [shortenName(d.name), d.sugar])} />
              </>
            )}
          </section>
        )}

        {!isLoading && data && data.length === 0 && (
          <div style={{ marginTop: 32, background: "#fff", padding: 24, borderRadius: 12, textAlign: "center", color: "#999", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
            📉 추천 결과 없음
          </div>
        )}
      </div>
    </main>
  );
}

// 공통 테이블 컴포넌트
function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <table style={{ marginTop: 20, width: "100%", borderCollapse: "collapse", fontSize: "0.95em" }}>
      <thead style={{ background: "#f8f9fa" }}>
        <tr>
          {headers.map((h, idx) => (
            <th key={idx} style={{ borderBottom: "2px solid #ccc", textAlign: "left", padding: "8px" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? "#fff" : "#f9f9f9" }}>
            {row.map((cell, cIdx) => (
              <td key={cIdx} style={{ padding: "6px 8px", borderBottom: "1px solid #eee" }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
