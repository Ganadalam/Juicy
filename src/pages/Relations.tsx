import RelationGraph from "../components/charts/RelationGraph";
import { useRecoilValue } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";
import { useRecommendation } from "../hooks/useFetchData";

type RecommendationItem = {
  name: string;
  score: number;
  price?: number;
  link?: string;
  region?: string;
};

export default function Relations() {
  const category = useRecoilValue(selectedCategoryState);
  const { data, isLoading, error } = useRecommendation(category);

  return (
    <main style={{ padding: "24px" }}>
      <h2>Relation Network</h2>
      <p>
        Current Category: <strong>{category}</strong>
      </p>

      {error && <p style={{ color: "red" }}>데이터를 불러오는 중 오류가 발생했습니다.</p>}

      <section style={{ marginTop: 16 }}>
        {/* RelationGraph에 추천 데이터도 전달 */}
        <RelationGraph category={category} recommendations={data ?? []} />

        <section style={{ marginTop: 24 }}>
          <h3>추천 상품</h3>
          {isLoading && <p>불러오는 중...</p>}
          {!isLoading && data && data.length === 0 && (
            <p style={{ color: "#999" }}>추천 결과 없음</p>
          )}

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {data?.map((r: RecommendationItem) => (
              <a
                key={r.name}
                href={r.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 12,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fafafa",
                }}
              >
                <strong>{r.name}</strong>
                <p>평점: {r.score}</p>
                <p>가격: {r.price ?? "정보 없음"}</p>
                {r.region && <p>지역: {r.region}</p>}
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
