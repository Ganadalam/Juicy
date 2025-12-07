import Plot from "react-plotly.js";

type Item = { name: string; score: number };

export default function BarChart({ data }: { data: Item[] }) {
  return (
    
    <Plot
      data={[
        {
          type: "bar",
          x: data.map((d) => d.name),
          y: data.map((d) => d.score),
          // text must be strings for typings in @types/plotly.js
          text: data.map((d) => String(d.score)),
          textposition: "auto",
          marker: { color: "rgba(99,110,250,0.75)" }
        }
      ]}
      layout={{
        // use object form to satisfy strict typings for title
        title: { text: "추천 점수" },
        margin: { t: 48, l: 48, r: 16, b: 48 },
        xaxis: { automargin: true },
        yaxis: { range: [0, 100] }
      }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{ displayModeBar: false, responsive: true }}
    />
    
  );
}
