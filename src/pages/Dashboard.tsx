import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";

import Loader from "../components/common/Loader";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";

const CATEGORIES = ["와인", "음료", "디저트"] as const;

export default function Dashboard() {
  const [category, setCategory] = useRecoilState(selectedCategoryState);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 카테고리별 API 호출
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (category === "와인") {
          const res = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=wine&json=true&page_size=10`
          );
          const json = await res.json();
          setData(
            json.products.map((p: any) => ({
              name: p.product_name,
              calories: p.nutriments?.["energy-kcal_100g"] ?? 0,
            }))
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
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=dessert&json=true&page_size=10`
          );
          const json = await res.json();
          setData(
            json.products.map((p: any, idx: number) => ({
              name: p.product_name || `Dessert ${idx + 1}`,
              sugar: p.nutriments?.["sugars_100g"] ?? 0,
            }))
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
    <main style={{ padding: "24px", background: "#f8f9fa", minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          background: "#fff",
          padding: "12px 16px",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: 0 }}>추천 결과</h2>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="카테고리 필터"
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </header>

      {isLoading && <Loader label="추천 데이터를 불러오는 중..." />}

      {!isLoading && data && data.length > 0 && (
        <section
          style={{
            height: 360,
            marginTop: 24,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 16,
          }}
        >
          {category === "와인" && (
            <BarChart
              data={data.map((item: any) => ({
                name: item.name ?? "와인",
                score: Number(item.calories) ?? 0,
              }))}
            />
          )}

          {category === "음료" && (
            <PieChart
              data={[
                {
                  name: "Alcoholic",
                  value: data.filter((d: any) => d.alcohol === "Alcoholic").length,
                },
                {
                  name: "Non-Alcoholic",
                  value: data.filter((d: any) => d.alcohol !== "Alcoholic").length,
                },
              ]}
            />
          )}

          {category === "디저트" && (
  <LineChart
    data={data
      .map((item: any, idx: number) => ({
        name: item.name ?? `Dessert ${idx + 1}`,
        value: Number(item.sugar ?? 0),
      }))
      .filter((d: any) => !isNaN(d.value))}
  />
)}

        </section>
      )}

      {!isLoading && data && data.length === 0 && (
        <p style={{ marginTop: 16, color: "#999" }}>추천 결과 없음</p>
      )}
    </main>
  );
}
