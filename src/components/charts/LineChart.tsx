import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface LineChartProps {
  data: { name: string; value: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<{ name: string; value: number }>()
      .x((d) => x(d.name)!)
      .y((d) => y(d.value));

    // X축
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Y축
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // 라인
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ff6600")
      .attr("stroke-width", 2)
      .attr("d", line);

    // 점 표시
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.name)!)
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#ff6600");
  }, [data]);

  return <svg ref={ref} width={600} height={300}></svg>;
}
