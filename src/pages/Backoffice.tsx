import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Item = {
  id: number;
  name: string;
  price?: number;
};

export default function Backoffice() {
  const queryClient = useQueryClient();

  // 상품 목록 조회
  const { data: items, isLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("상품 목록 불러오기 실패");
      return res.json();
    },
  });

  // 상품 추가
  const mutation = useMutation({
    mutationFn: async (newItem: Item) =>
      fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      }),
    onSuccess: () => {
      // 추가 후 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <main style={{ padding: "24px" }}>
      <h2>상품 관리</h2>

      {isLoading && <p>불러오는 중...</p>}
      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {item.name} {item.price ? `- ${item.price}원` : ""}
          </li>
        ))}
      </ul>

      <button
        onClick={() =>
          mutation.mutate({ id: Date.now(), name: "새 와인", price: 25000 })
        }
      >
        새 상품 추가
      </button>
    </main>
  );
}
// import { useMutation } from "@tanstack/react-query";

// export default function Backoffice() {
//   const mutation = useMutation({
//     mutationFn: async (newItem: any) =>
//       fetch("/api/items", { method: "POST", body: JSON.stringify(newItem) }),
//   });

//   return (
//     <main>
//       <h2>상품 관리</h2>
//       <button onClick={() => mutation.mutate({ name: "새 와인" })}>
//         새 상품 추가
//       </button>
//     </main>
//   );
// }
