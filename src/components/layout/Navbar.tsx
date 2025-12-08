import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  const active = (path: string) =>
    pathname === path
      ? {
          fontWeight: 700,
          color: darkMode ? "#fff" : "#111",
          borderBottom: `2px solid ${darkMode ? "#fff" : "#111"}`,
        }
      : { color: darkMode ? "#bbb" : "#555" };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    padding: "8px 0",
    transition: "all 0.3s ease",
  };

  const navLinks = (
    <>
      <Link to="/" style={{ ...linkStyle, ...active("/") }}>Home</Link>
      <Link to="/dashboard" style={{ ...linkStyle, ...active("/dashboard") }}>Dashboard</Link>
      <Link to="/relations" style={{ ...linkStyle, ...active("/relations") }}>Relations</Link>
      <Link to="/backoffice" style={{ ...linkStyle, ...active("/backoffice") }}>Backoffice</Link>
    </>
  );

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        borderBottom: `1px solid ${darkMode ? "#444" : "#eee"}`,
        position: "sticky",
        top: 0,
        background: darkMode ? "#111" : "#fff",
        zIndex: 10,
        boxShadow: darkMode
          ? "0 2px 6px rgba(0,0,0,0.6)"
          : "0 2px 6px rgba(0,0,0,0.05)",
      }}
      aria-label="Primary"
    >
      {/* 로고 */}
      <div style={{ fontWeight: 800, fontSize: "18px", color: darkMode ? "#fff" : "#333" }}>
        🍹 Juicy
      </div>

      {/* 데스크탑 메뉴 */}
      <div className="desktop-menu" style={{ display: "flex", gap: "28px" }}>
        {navLinks}
      </div>

      {/* 모바일 햄버거 */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
          color: darkMode ? "#fff" : "#111",
        }}
      >
        ☰
      </button>

      {/* 사용자 액션 */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: `1px solid ${darkMode ? "#666" : "#ddd"}`,
            background: darkMode ? "#222" : "#f9f9f9",
            color: darkMode ? "#eee" : "#333",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
        <button
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            background: darkMode ? "#fff" : "#111",
            color: darkMode ? "#111" : "#fff",
            cursor: "pointer",
          }}
        >
          회원가입
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px",
            borderRadius: "50%",
            border: "none",
            background: darkMode ? "#fff" : "#111",
            color: darkMode ? "#111" : "#fff",
            cursor: "pointer",
          }}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "24px",
            background: darkMode ? "#222" : "#fff",
            border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {navLinks}
        </div>
      )}
    </nav>
  );
}
