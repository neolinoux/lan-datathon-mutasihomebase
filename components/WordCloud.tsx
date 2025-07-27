// 'use client';

// import { useEffect, useRef } from 'react';
// import cloud from 'd3-cloud';
// import * as d3 from 'd3';

// type WordItem = {
//   text: string;
//   value: number;
// };

// type Props = {
//   words: WordItem[];
//   width?: number;
//   height?: number;
// };

// const WordCloud = ({ words, width = 600, height = 400 }: Props) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     d3.select(svgRef.current).selectAll('*').remove();

//     const values = words.map(w => w.value);
//     const fontScale = d3.scaleLinear()
//       .domain([Math.min(...values), Math.max(...values)])
//       .range([30, 100]); // ✅ atur ukuran font

//     const layout = cloud<WordItem>()
//       .size([width, height])
//       .words(words)
//       .padding(5)
//       .rotate(() => ~~(Math.random() * 2) * 90)
//       .font('Impact')
//       .fontSize((d) => fontScale(d.value)) // ✅ font size via scale
//       .on('end', draw);

//     layout.start();

//     function draw(words: cloud.Word[]) {
//       const svg = d3
//         .select(svgRef.current)
//         .attr('width', width)
//         .attr('height', height)
//         .append('g')
//         .attr('transform', `translate(${width / 2}, ${height / 2})`);

//       svg
//         .selectAll('text')
//         .data(words)
//         .enter()
//         .append('text')
//         .style('font-family', 'Impact')
//         .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
//         .style('font-size', (d) => `${d.size}px`)
//         .attr('text-anchor', 'middle')
//         .attr('transform', (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
//         .text((d) => d.text || '');
//     }
//   }, [words, width, height]);

//   return <svg ref={svgRef}></svg>;
// };

// export default WordCloud;
