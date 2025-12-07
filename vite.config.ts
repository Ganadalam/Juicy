import { defineConfig } from "vite";
export default defineConfig({
  server: {
    proxy: {
      "/api-food": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-food/, ""),
      },
    },
  },
});
