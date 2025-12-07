import { useQuery } from "@tanstack/react-query";

// Mock fetch — replace with real API later
async function fetchRecommendation(category: string) {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  const base = [
    { name: "A", score: 78 },
    { name: "B", score: 64 },
    { name: "C", score: 91 },
    { name: "D", score: 52 }
  ];
  // simple variation by category
  const factor = category === "와인" ? 1.1 : category === "음료" ? 0.95 : 1.0;
  return base.map((b) => ({ ...b, score: Math.round(b.score * factor) }));
}

export function useRecommendation(category: string) {
  return useQuery({
    queryKey: ["recommendation", category],
    queryFn: () => fetchRecommendation(category),
    staleTime: 60_000,
    gcTime: 5 * 60_000
  });
}
