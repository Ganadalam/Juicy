type ResultCardProps = {
  image?: string;
  title: string;
  subtitle?: string;
  description?: string;
  onFavorite?: () => void;
};

export function ResultCard({ image, title, subtitle, description, onFavorite }: ResultCardProps) {
  return (
    <li
      style={{
        listStyle: "none",
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
    >
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      {subtitle && <p style={{ fontSize: "0.9em", color: "#555" }}>{subtitle}</p>}
      {description && <p style={{ fontSize: "0.8em", color: "#777" }}>{description}</p>}
      {onFavorite && (
        <button
          onClick={onFavorite}
          style={{
            marginTop: 8,
            padding: "6px 10px",
            borderRadius: 6,
            border: "none",
            background: "#ffcc00",
            cursor: "pointer",
          }}
        >
          ⭐ 즐겨찾기
        </button>
      )}
    </li>
  );
}
