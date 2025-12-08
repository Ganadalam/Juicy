import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchSection } from "../components/common/SearchSection";
import "./Home.css";

const cache = new Map();

export default function Home() {
  const nav = useNavigate();
  const [foods, setFoods] = useState<any[]>([]);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [randomCocktails, setRandomCocktails] = useState<any[]>([]); // ✅ 배열로 변경
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [foodKeyword, setFoodKeyword] = useState("snack");
  const [cocktailKeyword, setCocktailKeyword] = useState("Margarita");

  // 음식 검색
  async function searchFoods(keyword: string = foodKeyword) {
    if (cache.has(`food-${keyword}`)) {
      setFoods(cache.get(`food-${keyword}`));
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${keyword}&json=true&page_size=10`
      );
      const data = await res.json();
      const results =
        data.products?.slice(0, 10).map((p: any) => ({
          name: p.product_name,
          calories: p.nutriments?.["energy-kcal_100g"],
          fat: p.nutriments?.["fat_100g"],
          protein: p.nutriments?.["proteins_100g"],
          image: p.image_url,
        })) || [];
      setFoods(results);
      cache.set(`food-${keyword}`, results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 칵테일 검색
  async function searchCocktails(keyword: string = cocktailKeyword) {
    if (cache.has(`cocktail-${keyword}`)) {
      setCocktails(cache.get(`cocktail-${keyword}`));
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`
      );
      const data = await res.json();
      const results =
        data.drinks?.slice(0, 10).map((d: any) => ({
          name: d.strDrink,
          category: d.strCategory,
          alcohol: d.strAlcoholic,
          instructions: d.strInstructions,
          image: d.strDrinkThumb,
        })) || [];
      setCocktails(results);
      cache.set(`cocktail-${keyword}`, results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 랜덤 칵테일 여러 개
  async function fetchRandomCocktails(count: number = 3) {
    try {
      const promises = Array.from({ length: count }, () =>
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then((res) => res.json())
      );
      const results = await Promise.all(promises);
      const cocktails = results.map((data) => ({
        name: data.drinks[0].strDrink,
        category: data.drinks[0].strCategory,
        alcohol: data.drinks[0].strAlcoholic,
        instructions: data.drinks[0].strInstructions,
        image: data.drinks[0].strDrinkThumb,
      }));
      setRandomCocktails(cocktails);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>AI 추천 결과 시각화 Dashboard</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        wine & drink & dessert (score & relation)
      </p>

      {loading && <div className="spinner">🔄 불러오는 중...</div>}
      {error && <div style={{ background: "#ffe0e0", padding: 12, borderRadius: 8 }}>에러: {error}</div>}

      {/* 음식 검색 */}
      <SearchSection
        title="🍎 음식 추천"
        keyword={foodKeyword}
        setKeyword={setFoodKeyword}
        onSearch={searchFoods}
        suggestions={["snack", "chocolate", "pizza", "bread"]}
        results={foods.map((f) => ({
          image: f.image,
          name: f.name,
          subtitle: `${f.calories ?? "-"} kcal · 지방 ${f.fat ?? "-"}g · 단백질 ${f.protein ?? "-"}g`,
        }))}
      />

      {/* 칵테일 검색 */}
      <SearchSection
        title="🍸 칵테일 추천"
        keyword={cocktailKeyword}
        setKeyword={setCocktailKeyword}
        onSearch={searchCocktails}
        suggestions={["Margarita", "Martini", "Mojito", "Cosmopolitan"]}
        results={cocktails.map((c) => ({
          image: c.image,
          name: c.name,
          subtitle: `${c.category} · ${c.alcohol}`,
          description: c.instructions,
        }))}
      />

      {/* 랜덤 칵테일 모달 */}
      <section style={{ marginTop: 32 }}>
        <h2>🎲 랜덤 칵테일 추천</h2>
        <button
          onClick={() => fetchRandomCocktails(4)} // 원하는 개수 지정
          style={{
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          랜덤 칵테일 불러오기
        </button>

        {randomCocktails.length > 0 && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ background: "#fff", padding: 24, borderRadius: 12, maxWidth: "80%", position: "relative" }}>
              {/* 닫기 버튼 X */}
              <button
                onClick={() => setRandomCocktails([])}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  border: "none",
                  background: "transparent",
                  fontSize: "1.2em",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>

              <h2 style={{ marginBottom: 16 }}>랜덤 칵테일 추천</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                {randomCocktails.map((c, idx) => (
                 <div
  key={idx}
  style={{
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
  }}
>
  <img
    src={c.image}
    alt={c.name}
    style={{
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: 8,
      marginBottom: 8,
    }}
  />
  <h3 style={{ margin: "8px 0", fontWeight: 600 }}>{c.name}</h3>
  <p style={{ fontSize: "0.9em", color: "#555" }}>{c.category} · {c.alcohol}</p>
</div>

                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dashboard 이동 버튼 */}
      <button
        onClick={() => nav("/dashboard")}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          cursor: "pointer",
          marginTop: 32,
          background: "#007bff",
          color: "#fff",
          border: "none",
        }}
      >
        Start!
      </button>
    </main>
  );
}
