import { useNavigate } from "react-router-dom";

export default function Home() {
    const nav = useNavigate();
    return (
        <main style={{ padding: "24px" }} >
            <h1> AI 추천 결과 시각화 DashBoaed </h1>
            <p>
                wine & drink $ dessert (score & relation)
            </p>

            <button
              onClick={() => nav("/dashboard")}
              style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer" }}
              >
                Start!
              </button>
        </main>
    )
}