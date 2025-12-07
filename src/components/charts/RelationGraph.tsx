import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface Node {
  id: string;
  group?: string;
}
interface Link {
  source: string;
  target: string;
  strength?: number;
}

export default function RelationGraph({ category }: { category: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = 640;
    const height = 420;

    const nodes: Node[] = [
      { id: "와인", group: "와인" },
      { id: "음료", group: "음료" },
      { id: "디저트", group: "디저트" },
      { id: "추천A", group: category },
      { id: "추천B", group: category },
      { id: "추천C", group: category }
    ];
    const links: Link[] = [
      { source: "와인", target: "디저트", strength: 0.5 },
      { source: "음료", target: "디저트", strength: 0.4 },
      { source: category, target: "추천A", strength: 0.7 },
      { source: category, target: "추천B", strength: 0.6 },
      { source: category, target: "추천C", strength: 0.8 }
    ];

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const color = d3
      .scaleOrdinal<string>()
      .domain(["와인", "음료", "디저트"])
      .range(["#a0522d", "#1f77b4", "#ff7f0e"]);

    const simulation = d3
      .forceSimulation(nodes as unknown as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(
            links as unknown as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[]
          )
          .id((d: any) => d.id)
          .strength((l: any) => l.strength ?? 0.5)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alpha(1)
      .alphaDecay(0.05);

    const linkSel = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => 1 + (d.strength ?? 0.5) * 2);

    const nodeSel = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => color(d.group ?? "디저트"))
      .call(
        d3
          .drag<SVGCircleElement, any>()
          .on("start", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeSel.append("title").text((d: any) => d.id);

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 12)
      .attr("dx", 12)
      .attr("dy", 4);

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeSel.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    // Cleanup must return a function that returns void
    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [category]);

  return <svg ref={ref} width={640} height={420} role="img" aria-label="관계 네트워크 그래프" />;
}
