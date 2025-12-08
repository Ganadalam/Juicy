import { useQuery } from "@tanstack/react-query";

// 🍎 음식 여러 개 검색
async function fetchFoodsByKeyword(keyword: string) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${keyword}&json=true`;
  const res = await fetch(url);
  const data = await res.json();

  return data.products.slice(0, 10).map((p: any) => ({
    name: p.product_name,
    calories: p.nutriments?.["energy-kcal_100g"],
    fat: p.nutriments?.["fat_100g"],
    protein: p.nutriments?.["proteins_100g"],
    image: p.image_url,
  }));
}

// 🍷 칵테일 이름 검색
async function fetchCocktailByName(name: string) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`;
  const res = await fetch(url);
  const data = await res.json();

  return data.drinks?.map((drink: any) => ({
    name: drink.strDrink,
    category: drink.strCategory,
    alcohol: drink.strAlcoholic,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
  })) ?? [];
}

// 🍷 칵테일 카테고리별
async function fetchCocktailsByCategory(category: string = "Cocktail") {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;
  const res = await fetch(url);
  const data = await res.json();

  return data.drinks?.map((d: any) => ({
    name: d.strDrink,
    image: d.strDrinkThumb,
    id: d.idDrink,
  })) ?? [];
}

// 🍷 랜덤 칵테일
async function fetchRandomCocktail() {
  const url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
  const res = await fetch(url);
  const data = await res.json();

  const drink = data.drinks[0];
  return {
    name: drink.strDrink,
    category: drink.strCategory,
    alcohol: drink.strAlcoholic,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
  };
}

// 공통 훅
export function useRecommendation(
  type: string,
  query?: string,
  mode: "name" | "category" | "random" = "name"
) {
  return useQuery({
    queryKey: [type, query, mode],
    queryFn: async () => {
      if (type === "음식" && query) return fetchFoodsByKeyword(query);
      if (type === "술") {
        if (mode === "name" && query) return fetchCocktailByName(query);
        if (mode === "category") return fetchCocktailsByCategory(query ?? "Cocktail");
        if (mode === "random") return fetchRandomCocktail();
      }
      if (type === "디저트" && query) {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=true&page_size=5`;
        const res = await fetch(url);
        const data = await res.json();
        return data.products
          .map((p: any, idx: number) => ({
            name: p.product_name || `Dessert ${idx + 1}`,
            sugar: Number(p.nutriments?.["sugars_100g"] ?? 0),
          }))
          .filter((d: any) => !isNaN(d.sugar));
      }
      return [];
    },
    enabled: type === "음식" ? !!query : true,
    staleTime: 1000 * 60 * 5,   // 5분 동안 fresh
    gcTime: 1000 * 60 * 30,  // 30분 캐시 유지
  });
}

