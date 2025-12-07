import { useRecoilState } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";
import { useRecommendation } from "../hooks/useFetchData";
import Loader from "../components/common/Loader";
import BarChart from "../components/charts/BarChart";

const CATEGORIES = ["와인", "음료", "디저트"] as const;

export default function Dashboard() {
  const [category, setCategory] = useRecoilState(selectedCategoryState);
  const { data, isLoading } = useRecommendation(category);

  return (
    <main style={{ padding: "24px" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h2>추천 결과</h2>
        <label htmlFor="category">
          <span className="sr-only">카테고리 선택</span>
        </label>
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

      {!isLoading && data && (
        <section style={{ height: 360, marginTop: 16 }}>
          <BarChart data={data} />
        </section>
      )}
    </main>
  );
}
