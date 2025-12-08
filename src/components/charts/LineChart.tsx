import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface LineChartProps {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
  pointRadius?: number;
}

export default function LineChart({
  data,
  height = 300,
  color = "#ff6600",
  pointRadius = 4,
}: LineChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // 반응형을 위해 width는 부모 컨테이너 크기 기준
    const width = ref.current?.clientWidth ?? 600;
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.5);

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
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

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
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line)
      .attr("stroke-dasharray", function () {
        const totalLength = (this as SVGPathElement).getTotalLength();
        return `${totalLength} ${totalLength}`;
      })
      .attr("stroke-dashoffset", function () {
        return (this as SVGPathElement).getTotalLength();
      })
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // 점 표시 (애니메이션 포함)
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.name)!)
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", color)
      .transition()
      .duration(800)
      .attr("r", pointRadius);
  }, [data, height, color, pointRadius]);

  return (
    <svg
      ref={ref}
      style={{ width: "100%", height }} // 반응형: 부모 div 기준 100% 폭
      viewBox={`0 0 600 ${height}`} // 내부 좌표계
      preserveAspectRatio="xMidYMid meet"
    ></svg>
  );
}
