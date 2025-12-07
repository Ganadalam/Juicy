import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const active = (path: string) =>
    pathname === path ? { fontWeight: 700, borderBottom: "2px solid #222" } : {};

  return (
    <nav
      style={{
        display: "flex",
        gap: "16px",
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        background: "#fff",
        zIndex: 10
      }}
      aria-label="Primary"
    >
      <Link to="/" style={active("/")}>Home</Link>
      <Link to="/dashboard" style={active("/dashboard")}>Dashboard</Link>
      <Link to="/relations" style={active("/relations")}>Relations</Link>
      <Link to="/backoffice" style={active("/backoffice")}>Backoffice</Link>
  
  
    </nav>
  );
}
