import React, { useState } from 'react';
import { ProjectedYearStatement } from '../../types/businessPlan';
import { formatPlanCurrency } from '../../utils/currency';

interface BarChart5YearProps {
  projections: ProjectedYearStatement[];
  currency?: string;
  metricType?: 'revenue_ebitda' | 'profit_debt';
  title?: string;
  subtitle?: string;
}

export const BarChart5Year: React.FC<BarChart5YearProps> = ({
  projections,
  currency = 'USD',
  metricType = 'revenue_ebitda',
  title,
  subtitle,
}) => {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  if (!projections || projections.length === 0) return null;

  // Find max value for Y-axis scaling
  const maxVal = Math.max(
    ...projections.map((p) =>
      metricType === 'revenue_ebitda'
        ? Math.max(p.revenue, p.grossProfit, p.ebitda)
        : Math.max(p.netIncome, p.annualDebtService, p.ebitda)
    ),
    100000
  );

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Grid steps (4 horizontal guide lines)
  const steps = [0, 0.25, 0.5, 0.75, 1];

  const yearWidth = chartWidth / projections.length;
  const barWidth = yearWidth * 0.24;

  const activeStatement = hoveredYear
    ? projections.find((p) => p.year === hoveredYear)
    : null;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2 mb-2">
        <div>
          <h4 className="text-xs font-semibold text-slate-100">
            {title || (metricType === 'revenue_ebitda'
              ? '5-Year Top-Line Revenue vs Operating Profitability (EBITDA)'
              : '5-Year Net Income vs Annual Debt Service Requirements')}
          </h4>
          <span className="text-[11px] text-slate-400">
            {subtitle || (metricType === 'revenue_ebitda'
              ? 'Measures revenue scaling against operational cash generation'
              : 'Substantiates repayment capability after operating expenses')}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          {metricType === 'revenue_ebitda' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
                <span className="text-slate-300">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-400"></span>
                <span className="text-slate-300">Gross Profit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                <span className="text-slate-300">EBITDA</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                <span className="text-slate-300">EBITDA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span>
                <span className="text-slate-300">Net Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-400"></span>
                <span className="text-slate-300">Debt Service</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Background Grid Lines & Y-axis labels */}
          {steps.map((ratio, idx) => {
            const val = maxVal * ratio;
            const y = paddingTop + chartHeight - chartHeight * ratio;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {formatPlanCurrency(val, currency, true)}
                </text>
              </g>
            );
          })}

          {/* Bars grouped by Year */}
          {projections.map((p, idx) => {
            const yearX = paddingLeft + idx * yearWidth;
            const isHovered = hoveredYear === p.year;

            // Height computations
            const hRev = Math.max(0, (p.revenue / maxVal) * chartHeight);
            const hGross = Math.max(0, (p.grossProfit / maxVal) * chartHeight);
            const hEbitda = Math.max(0, (p.ebitda / maxVal) * chartHeight);
            const hNet = Math.max(0, (p.netIncome / maxVal) * chartHeight);
            const hDebt = Math.max(0, (p.annualDebtService / maxVal) * chartHeight);

            const yBase = paddingTop + chartHeight;

            return (
              <g
                key={p.year}
                onMouseEnter={() => setHoveredYear(p.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className="cursor-pointer"
              >
                {/* Hover Backdrop Highlight */}
                <rect
                  x={yearX + 4}
                  y={paddingTop}
                  width={yearWidth - 8}
                  height={chartHeight}
                  fill={isHovered ? '#1e293b' : 'transparent'}
                  opacity={isHovered ? 0.6 : 0}
                  rx="4"
                  className="transition-opacity duration-150"
                />

                {metricType === 'revenue_ebitda' ? (
                  <>
                    {/* Bar 1: Revenue */}
                    <rect
                      x={yearX + yearWidth * 0.12}
                      y={yBase - hRev}
                      width={barWidth}
                      height={hRev}
                      fill="#0284c7"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    {/* Bar 2: Gross Profit */}
                    <rect
                      x={yearX + yearWidth * 0.12 + barWidth + 3}
                      y={yBase - hGross}
                      width={barWidth}
                      height={hGross}
                      fill="#6366f1"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    {/* Bar 3: EBITDA */}
                    <rect
                      x={yearX + yearWidth * 0.12 + (barWidth + 3) * 2}
                      y={yBase - hEbitda}
                      width={barWidth}
                      height={hEbitda}
                      fill="#f59e0b"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                  </>
                ) : (
                  <>
                    {/* Bar 1: EBITDA */}
                    <rect
                      x={yearX + yearWidth * 0.12}
                      y={yBase - hEbitda}
                      width={barWidth}
                      height={hEbitda}
                      fill="#f59e0b"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    {/* Bar 2: Net Income */}
                    <rect
                      x={yearX + yearWidth * 0.12 + barWidth + 3}
                      y={yBase - hNet}
                      width={barWidth}
                      height={hNet}
                      fill="#10b981"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    {/* Bar 3: Debt Service */}
                    <rect
                      x={yearX + yearWidth * 0.12 + (barWidth + 3) * 2}
                      y={yBase - hDebt}
                      width={barWidth}
                      height={hDebt}
                      fill="#f43f5e"
                      rx="2"
                      opacity={isHovered ? 1 : 0.85}
                    />
                  </>
                )}

                {/* X-axis Label */}
                <text
                  x={yearX + yearWidth / 2}
                  y={yBase + 18}
                  textAnchor="middle"
                  fill={isHovered ? '#f59e0b' : '#94a3b8'}
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  Year {p.year}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip readout on Hover */}
        {activeStatement && (
          <div className="mt-2 p-2.5 rounded bg-slate-900 border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-200">
            <span className="font-bold text-amber-400 font-mono">
              Year {activeStatement.year} Projections:
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>
                Revenue: <strong className="text-sky-400">{formatPlanCurrency(activeStatement.revenue, currency)}</strong>
              </span>
              <span>
                Gross Profit: <strong className="text-indigo-300">{formatPlanCurrency(activeStatement.grossProfit, currency)}</strong>
              </span>
              <span>
                EBITDA: <strong className="text-amber-400">{formatPlanCurrency(activeStatement.ebitda, currency)}</strong>
              </span>
              <span>
                DSCR: <strong className={activeStatement.dscr >= 1.25 ? 'text-emerald-400' : 'text-rose-400'}>{activeStatement.dscr.toFixed(2)}x</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
