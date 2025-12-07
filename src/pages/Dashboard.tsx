import { useRecoilState } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";
import { useRecommendation } from "../hooks/useFetchData";

import Loader from "../components/common/Loader";
import BarChart from "../components/charts/BarChart";   // D3 기반 BarChart
import PieChart from "../components/charts/PieChart";   // D3 기반 PieChart
import LineChart from "../components/charts/LineChart"; // D3 기반 LineChart

const CATEGORIES = ["와인", "음료", "디저트"] as const;

export default function Dashboard() {
  const [category, setCategory] = useRecoilState(selectedCategoryState);
  const { data, isLoading } = useRecommendation(category, "Margarita");

  console.log("추천 데이터:", data);

  // 테스트용 더미 데이터 (API가 빈 배열 반환 시 확인용)
  const dummyWine = [
    { name: "Wine A", calories: 120 },
    { name: "Wine B", calories: 150 },
  ];
  const dummyDessert = [
    { name: "Cake", sugar: 30 },
    { name: "Ice Cream", sugar: 25 },
  ];
  const dummyCocktail = [
    { name: "Margarita", alcohol: "Alcoholic" },
    { name: "Virgin Mojito", alcohol: "Non-Alcoholic" },
  ];

  const chartData = data && data.length > 0 ? data : (
    category === "와인" ? dummyWine :
    category === "음료" ? dummyCocktail :
    dummyDessert
  );

  return (
    <main style={{ padding: "24px" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h2>추천 결과</h2>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="카테고리 필터"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </header>

      {isLoading && <Loader label="추천 데이터를 불러오는 중..." />}

      {!isLoading && chartData && chartData.length > 0 && (
        <section style={{ height: 360, marginTop: 16 }}>
          {category === "와인" && (
            <BarChart
              data={chartData.map((item: any) => ({
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
                  value: chartData.filter((d: any) => d.alcohol === "Alcoholic").length,
                },
                {
                  name: "Non-Alcoholic",
                  value: chartData.filter((d: any) => d.alcohol !== "Alcoholic").length,
                },
              ]}
            />
          )}

          {category === "디저트" && (
            <LineChart
              data={chartData.map((item: any, idx: number) => ({
                name: item.name ?? `Dessert ${idx + 1}`,
                value: Number(item.sugar) ?? 0,
              }))}
            />
          )}
        </section>
      )}

      {!isLoading && chartData && chartData.length === 0 && (
        <p style={{ marginTop: 16, color: "#999" }}>추천 결과 없음</p>
      )}
    </main>
  );
}
