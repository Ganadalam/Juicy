import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../store/queryClient";
import AppRoutes from "./routes";
import Navbar from "../components/layout/Navbar";

export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />   {/* Router 안에서 Navbar를 같이 렌더링 */}
      </QueryClientProvider>
    </RecoilRoot>
  );
}