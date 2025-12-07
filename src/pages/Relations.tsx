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

  return (
    <main style={{ padding: "24px" }}>
      <h2>Relation Network</h2>
      <p>
        Current Category: <strong>{category}</strong>
      </p>
      <section style={{ marginTop: 16 }}>
        <RelationGraph category={category} />

        <section>
          <h3>추천 상품</h3>
          {isLoading && <p>불러오는 중...</p>}
          {data?.map((r: RecommendationItem) => (
            <a
              key={r.name}
              href={r.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.name} (평점: {r.score}, 가격: {r.price ?? "정보 없음"})
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}
