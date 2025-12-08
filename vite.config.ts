import { defineConfig } from "vite";
export default defineConfig({
  server: {
    proxy: {
      
      "/api": "http://localhost:4000", // 백엔드 주소
      "/api-food": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-food/, ""),
      },
    },
  },
});
