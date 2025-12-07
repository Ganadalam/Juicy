import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";


const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Express proxy server is running 🚀");
});


// 우리술 API 프록시
app.get("/api/liquor", async (req, res) => {
  const key = process.env.JEONNAM_API_KEY;
  const url = `https://api.odcloud.kr/api/3036051/v1/uddi:ea36c8b5-9d66-4e55-8c02-a86086a4a29b?page=1&perPage=20&returnType=JSON&serviceKey=${key}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// 음식 API 프록시
app.get("/api/food", async (req, res) => {
  const key = process.env.FOOD_API_KEY;
  const foodCode = req.query.code || "F0001";
  const url = `https://apis.data.go.kr/1390803/AgriFood/MzenFoodNutri?serviceKey=${key}&food_Code=${foodCode}`;
  const response = await fetch(url);
  const text = await response.text(); // XML 응답
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
