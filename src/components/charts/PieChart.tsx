import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // 기존 차트 초기화

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<{ name: string; value: number }>().value((d) => d.value);
    const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(String(i)));

    // 라벨 표시
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => d.data.name);
  }, [data]);

  return <svg ref={ref} width={400} height={300}></svg>;
}
