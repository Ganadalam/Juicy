import RelationGraph from "../components/charts/RelationGraph";
import { useRecoilValue } from "recoil";
import { selectedCategoryState } from "../store/recoilAtoms";

export default function Relations() {
  const category = useRecoilValue(selectedCategoryState);
  return (
    <main style={{ padding: "24px" }}>
      <h2>관계 네트워크</h2>
      <p>
        현재 카테고리: <strong>{category}</strong>
      </p>
      <section style={{ marginTop: 16 }}>
        <RelationGraph category={category} />
      </section>
    </main>
  );
}
