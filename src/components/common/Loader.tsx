export default function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" style={{ padding: "24px", textAlign: "center" }}>
      {label}
    </div>
  );
}
