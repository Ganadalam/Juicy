import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Item = {
  id: number;
  name: string;
  price?: number;
  image?: string;   // ✅ 상품 이미지 URL
  link?: string;    // ✅ 외부 링크
  description?: string; // ✅ 추가 설명
};

export default function Backoffice() {
  const queryClient = useQueryClient();

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newImage, setNewImage] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // 상품 목록 조회
  const { data: items, isLoading, error } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error("상품 목록 불러오기 실패");
      return res.json();
    },
  });

  // 상품 추가
  const addMutation = useMutation({
    mutationFn: async (newItem: Item) =>
      fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setNewName("");
      setNewPrice("");
      setNewImage("");
      setNewLink("");
      setNewDesc("");
    },
  });

  // 상품 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      fetch(`/api/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <main style={{ padding: "24px" }}>
      <h2>상품 관리</h2>

      {isLoading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>에러 발생: {(error as Error).message}</p>}

      {/* 상품 목록 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
            <th style={{ textAlign: "left", padding: "8px" }}>이미지</th>
            <th style={{ textAlign: "left", padding: "8px" }}>상품명</th>
            <th style={{ textAlign: "left", padding: "8px" }}>가격</th>
            <th style={{ textAlign: "left", padding: "8px" }}>링크</th>
            <th style={{ textAlign: "left", padding: "8px" }}>설명</th>
            <th style={{ textAlign: "left", padding: "8px" }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{item.id}</td>
              <td style={{ padding: "8px" }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                ) : (
                  "-"
                )}
              </td>
              <td style={{ padding: "8px" }}>{item.name}</td>
              <td style={{ padding: "8px" }}>{item.price ? `${item.price}원` : "-"}</td>
              <td style={{ padding: "8px" }}>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    바로가기
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td style={{ padding: "8px" }}>{item.description ?? "-"}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  style={{
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "4px",
                    background: "#e74c3c",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상품 추가 폼 */}
      <section style={{ marginTop: "24px" }}>
        <h3>새 상품 추가</h3>
        <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr" }}>
          <input
            type="text"
            placeholder="상품명"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            type="number"
            placeholder="가격"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            style={{ padding: "8px" }}
          />
          <input
            type="text"
            placeholder="이미지 URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            style={{ padding: "8px" }}
          />
          <input
            type="text"
            placeholder="외부 링크"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            style={{ padding: "8px" }}
          />
          <textarea
            placeholder="상품 설명"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            style={{ gridColumn: "span 2", padding: "8px" }}
          />
        </div>
        <button
          onClick={() =>
            addMutation.mutate({
              id: Date.now(),
              name: newName,
              price: newPrice === "" ? undefined : newPrice,
              image: newImage || undefined,
              link: newLink || undefined,
              description: newDesc || undefined,
            })
          }
          disabled={!newName || addMutation.isPending}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#2ecc71",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {addMutation.isPending ? "추가 중..." : "추가"}
        </button>
      </section>
    </main>
  );
}
