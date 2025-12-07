// routes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Relations from "../pages/Relations";
import Navbar from "../components/layout/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />   {/* ✅ Router 안에서 Navbar 렌더링 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/relations" element={<Relations />} />
      </Routes>
    </BrowserRouter>
  );
}
