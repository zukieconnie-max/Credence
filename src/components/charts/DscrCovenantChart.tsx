import React, { useState } from 'react';
import { ProjectedYearStatement } from '../../types/businessPlan';

interface DscrCovenantChartProps {
  projections: ProjectedYearStatement[];
  benchmark?: number; // Default 1.25x
}

export const DscrCovenantChart: React.FC<DscrCovenantChartProps> = ({
  projections,
  benchmark = 1.25,
}) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  if (!projections || projections.length === 0) return null;

  const maxDscr = Math.max(...projections.map((p) => p.dscr), benchmark, 2.5);

  const svgWidth = 500;
  const svgHeight = 200;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const yBase = paddingTop + chartHeight;
  const benchmarkY = yBase - (benchmark / maxDscr) * chartHeight;

  const yearWidth = chartWidth / projections.length;
  const barWidth = yearWidth * 0.42;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <div>
          <h4 className="text-xs font-semibold text-slate-100">
            Debt Service Coverage Ratio (DSCR) vs Bank Covenant
          </h4>
          <span className="text-[11px] text-slate-400">
            Required by bank underwriters to stay above the 1.25x covenant line
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-400"></span>
          <span className="text-rose-400 font-semibold">{benchmark.toFixed(2)}x Bank Threshold</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Y-axis guide ticks */}
          {[0, 1.0, 1.25, 2.0, maxDscr].map((val, idx) => {
            const y = yBase - (val / maxDscr) * chartHeight;
            if (y < paddingTop - 5) return null;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val.toFixed(1)}x
                </text>
              </g>
            );
          })}

          {/* Critical 1.25x Benchmark Covenant Line */}
          <line
            x1={paddingLeft}
            y1={benchmarkY}
            x2={svgWidth - paddingRight}
            y2={benchmarkY}
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={svgWidth - paddingRight - 4}
            y={benchmarkY - 4}
            textAnchor="end"
            fill="#f43f5e"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Policy Minimum: {benchmark.toFixed(2)}x
          </text>

          {/* DSCR Bars */}
          {projections.map((p, idx) => {
            const barX = paddingLeft + idx * yearWidth + (yearWidth - barWidth) / 2;
            const barH = Math.max(2, (p.dscr / maxDscr) * chartHeight);
            const isPassing = p.dscr >= benchmark;
            const isHovered = hoveredYear === p.year;

            const fillColor = isPassing ? '#10b981' : p.dscr >= 1.0 ? '#f59e0b' : '#f43f5e';

            return (
              <g
                key={p.year}
                onMouseEnter={() => setHoveredYear(p.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className="cursor-pointer"
              >
                {/* Bar */}
                <rect
                  x={barX}
                  y={yBase - barH}
                  width={barWidth}
                  height={barH}
                  fill={fillColor}
                  rx="3"
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-all duration-150"
                />

                {/* Value text above bar */}
                <text
                  x={barX + barWidth / 2}
                  y={yBase - barH - 5}
                  textAnchor="middle"
                  fill={fillColor}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {p.dscr.toFixed(2)}x
                </text>

                {/* Year Label */}
                <text
                  x={barX + barWidth / 2}
                  y={yBase + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#f59e0b' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  Y{p.year}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic caption */}
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>
            {projections.every((p) => p.dscr >= benchmark) ? (
              <span className="text-emerald-400 font-semibold">
                ✓ Full 5-Year Covenant Compliance (All periods ≥ {benchmark.toFixed(2)}x)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                ⚠ Covenant Exception in Early Years (Requires bank mitigating factors)
              </span>
            )}
          </span>
          <span className="font-mono text-slate-300">
            Average: {(projections.reduce((s, p) => s + p.dscr, 0) / projections.length).toFixed(2)}x
          </span>
        </div>
      </div>
    </div>
  );
};
