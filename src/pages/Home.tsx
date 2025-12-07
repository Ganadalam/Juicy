import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cache = new Map();


export default function Home() {
  const nav = useNavigate();
  const [foods, setFoods] = useState<any[]>([]);
  const [cocktails, setCocktails] = useState<any[]>([]);
  const [randomCocktail, setRandomCocktail] = useState<any | null>(null);
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
        data.products && data.products.length > 0
          ? data.products.slice(0, 10).map((p: any) => ({
              name: p.product_name,
              calories: p.nutriments?.["energy-kcal_100g"],
              fat: p.nutriments?.["fat_100g"],
              protein: p.nutriments?.["proteins_100g"],
              image: p.image_url,
            }))
          : [];
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
        data.drinks && data.drinks.length > 0
          ? data.drinks.slice(0, 10).map((d: any) => ({
              name: d.strDrink,
              category: d.strCategory,
              alcohol: d.strAlcoholic,
              instructions: d.strInstructions,
              image: d.strDrinkThumb,
            }))
          : [];
      setCocktails(results);
      cache.set(`cocktail-${keyword}`, results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 랜덤 칵테일
  async function fetchRandomCocktail() {
    try {
      const res = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php"
      );
      const data = await res.json();
      setRandomCocktail({
        name: data.drinks[0].strDrink,
        category: data.drinks[0].strCategory,
        alcohol: data.drinks[0].strAlcoholic,
        instructions: data.drinks[0].strInstructions,
        image: data.drinks[0].strDrinkThumb,
      });
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

      {loading && <p>데이터 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}

      
      {/* 음식 검색 */}
      <section>
        <h2>🍎 음식 추천</h2>
        <div style={{ marginBottom: 12 }}>
          <input
            value={foodKeyword}
            onChange={(e) => setFoodKeyword(e.target.value)}
             onKeyDown={(e) => e.key === "Enter" && searchFoods()}
            placeholder="음식 검색어 입력 (예: snack, chocolate)"
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            onClick={() => searchFoods()}
            style={{
              marginLeft: 8,
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            검색
          </button>
          {/* 추천 키워드 버튼 */}
          <div style={{ marginTop: 8 }}>
            {["snack", "chocolate", "pizza", "bread"].map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setFoodKeyword(kw);
                  searchFoods(kw);
                }}
                style={{
                  marginRight: 6,
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: "#eee",
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
        {foods.length === 0 ? (
          <p>검색 결과 없음</p>
        ) : (
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {foods.map((f, idx) => (
              <li
                key={idx}
                style={{
                  listStyle: "none",
                  border: "1px solid #ddd",
                  padding: 12,
                  borderRadius: 8,
                  background: "#fafafa",
                }}
              >
                {f.image && (
                  <img
                    src={f.image}
                    alt={f.name}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )}
                <h3>{f.name}</h3>
                <p style={{ fontSize: "0.9em", color: "#555" }}>
                  {f.calories} kcal · 지방 {f.fat}g · 단백질 {f.protein}g
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 칵테일 검색 */}
      <section style={{ marginTop: 32 }}>
        <h2>🍸 칵테일 추천</h2>
        <div style={{ marginBottom: 12 }}>
          <input
            value={cocktailKeyword}
            onChange={(e) => setCocktailKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCocktails()}

            placeholder="칵테일 이름 입력 (예: Margarita, Mojito)"
            style={{ padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button
            onClick={() => searchCocktails()}
            style={{
              marginLeft: 8,
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            검색
          </button>
          {/* 추천 키워드 버튼 */}
          <div style={{ marginTop: 8 }}>
            {["Margarita", "Martini", "Mojito", "Cosmopolitan"].map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setCocktailKeyword(kw);
                  searchCocktails(kw);
                }}
                style={{
                  marginRight: 6,
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: "#eee",
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
        {cocktails.length === 0 ? (
          <p>검색 결과 없음</p>
        ) : (
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {cocktails.map((c, idx) => (
              <li
                key={idx}
                style={{
                  listStyle: "none",
                  border: "1px solid #ddd",
                  padding: 12,
                  borderRadius: 8,
                  background: "#fafafa",
                }}
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                )}
                <h3>{c.name}</h3>
                <p style={{ fontSize: "0.9em", color: "#555" }}>
                  {c.category} · {c.alcohol}
                </p>
                <p style={{ fontSize: "0.8em", color: "#777" }}>
                  {c.instructions}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 랜덤 칵테일 */}
      <section style={{ marginTop: 32 }}>
        <h2>🎲 랜덤 칵테일 추천</h2>
        <button
          onClick={fetchRandomCocktail}
          style={{
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 12,
                    cursor: "pointer",
          }}
        >
          랜덤 칵테일 불러오기
        </button>
        {randomCocktail && (
          <div
            style={{
             
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <img
              src={randomCocktail.image}
              alt={randomCocktail.name}
              style={{ width: "20%", borderRadius: 8 }}
            />
            <h3>{randomCocktail.name}</h3>
            <p style={{ fontSize: "0.9em", color: "#555" }}>
              {randomCocktail.category} · {randomCocktail.alcohol}
            </p>
            <p style={{ fontSize: "0.8em", color: "#777" }}>
              {randomCocktail.instructions}
            </p>
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
