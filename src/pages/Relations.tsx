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
  const { data, isLoading } = useRecommendation(category);

   // Relations 전용 매핑
  const mappedData: RecommendationItem[] = (data ?? []).map((item: any) => ({
    name: item.name,
    score: item.calories ?? item.sugar ?? (item.alcohol === "Alcoholic" ? 80 : 50),
    price: item.price,
    link: item.image,
    region: item.region ?? item.category,
  }));

  return (
    <main style={{ padding: "32px", background: "#f0f2f5", minHeight: "100vh" }}>
      <h2 style={{ fontWeight: 600 }}>Relation Network</h2>
      <p>
        Current Category: <strong>{category}</strong>
      </p>

      <section
        style={{
          marginTop: 24,
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* 네트워크 그래프 */}
        <RelationGraph category={category} />

        {/* 추천 상품 리스트 */}
        <section style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 16 }}>추천 상품</h3>
          {isLoading && <p>불러오는 중...</p>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            {mappedData?.map((r) => (
              <a
                key={r.name}
                href={r.link ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#fafafa",
                  borderRadius: 8,
                  padding: 16,
                  textDecoration: "none",
                  color: "#333",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
              >
                <h4 style={{ margin: "0 0 8px", fontSize: "1.1em" }}>{r.name}</h4>
                <p style={{ margin: "4px 0", fontSize: "0.9em" }}>
                  평점:{" "}
                  <strong
                    style={{
                      color:
                        r.score >= 80 ? "green" : r.score >= 50 ? "orange" : "red",
                    }}
                  >
                    {r.score}
                  </strong>
                </p>
                <p style={{ margin: "4px 0", fontSize: "0.9em" }}>
                  가격: {r.price ?? "정보 없음"}
                </p>
                {r.region && (
                  <p style={{ margin: "4px 0", fontSize: "0.9em" }}>지역: {r.region}</p>
                )}
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
