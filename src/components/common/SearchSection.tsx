

type SearchSectionProps = {
  title: string;                // 섹션 제목 (🍎 음식 추천, 🍸 칵테일 추천 등)
  keyword: string;              // 현재 검색어 상태
  setKeyword: (kw: string) => void;
  onSearch: (kw?: string) => void;
  suggestions: string[];        // 추천 키워드 배열
  results: {
    image?: string;
    name: string;
    subtitle?: string;
    description?: string;
  }[];
};

export function SearchSection({
  title,
  keyword,
  setKeyword,
  onSearch,
  suggestions,
  results,
}: SearchSectionProps) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2>{title}</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={`${title} 검색어 입력`}
          style={{ padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={() => onSearch()}
          style={{
            marginLeft: 8,
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          검색
        </button>
        <div style={{ marginTop: 8 }}>
          {suggestions.map((kw) => (
            <button
              key={kw}
              onClick={() => {
                setKeyword(kw);
                onSearch(kw);
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

      {results.length === 0 ? (
        <p>검색 결과 없음</p>
      ) : (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {results.map((r, idx) => (
            <li
              key={idx}
              style={{
                listStyle: "none",
                border: "1px solid #ddd",
                padding: 16,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.name} 
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                }} />
              )}
              <h3 style={{ margin: "8px 0" }}>{r.name}</h3>
              {r.subtitle && <p style={{ fontSize: "0.9em", color: "#555" }}>{r.subtitle}</p>}
              {r.description && <p style={{ fontSize: "0.8em", color: "#777" }}>{r.description}</p>}
              <button
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: "#ffcc00",
                  cursor: "pointer",
                }}
              >
                ⭐
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
