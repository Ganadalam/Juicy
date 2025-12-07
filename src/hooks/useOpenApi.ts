import { useQuery } from "@tanstack/react-query";

// 🍎 음식 API (OpenFoodFacts)
async function fetchFoodInfo(barcode: string) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.product) return null;

  return {
    name: data.product.product_name,
    calories: data.product.nutriments?.["energy-kcal_100g"],
    fat: data.product.nutriments?.["fat_100g"],
    protein: data.product.nutriments?.["proteins_100g"],
  };
}

// 🍷 술 API (CocktailDB)
async function fetchCocktail(name: string) {
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.drinks) return [];

  return data.drinks.map((drink: any) => ({
    name: drink.strDrink,
    category: drink.strCategory,
    alcohol: drink.strAlcoholic,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
  }));
}

// 공통 훅
export function useOpenApi(category: "음식" | "술", query: string | null) {
  return useQuery({
    queryKey: [category, query],
    queryFn: async () => {
      if (!query) return []; // query 없을 때 안전하게 빈 배열 반환
      if (category === "음식") return fetchFoodInfo(query);
      if (category === "술") return fetchCocktail(query);
      return [];
    },
    enabled: !!query, // query 없으면 실행 안 함
  });
}
