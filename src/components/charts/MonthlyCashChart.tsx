import React, { useState } from 'react';
import { MonthlyCashFlowMonth } from '../../types/businessPlan';
import { formatPlanCurrency } from '../../utils/currency';

interface MonthlyCashChartProps {
  monthlyData: MonthlyCashFlowMonth[];
  currency?: string;
  title?: string;
  subtitle?: string;
}

export const MonthlyCashChart: React.FC<MonthlyCashChartProps> = ({
  monthlyData,
  currency = 'USD',
  title,
  subtitle,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  if (!monthlyData || monthlyData.length === 0) return null;

  // Max value for dual axis or unified scale
  const maxInflow = Math.max(...monthlyData.map((m) => Math.max(m.cashInflow, m.cashOutflow)));
  const maxCash = Math.max(...monthlyData.map((m) => m.endingCash));
  const minCash = Math.min(...monthlyData.map((m) => m.endingCash));

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const yBase = paddingTop + chartHeight;

  const monthWidth = chartWidth / monthlyData.length;
  const barWidth = monthWidth * 0.32;

  // Points for Ending Cash Balance line/area
  const cashMaxBound = Math.max(maxCash * 1.1, 50000);
  const cashPoints = monthlyData.map((m, idx) => {
    const x = paddingLeft + idx * monthWidth + monthWidth / 2;
    const y = yBase - (Math.max(0, m.endingCash) / cashMaxBound) * chartHeight;
    return { x, y, data: m };
  });

  const pathD = cashPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${cashPoints[cashPoints.length - 1].x} ${yBase} L ${cashPoints[0].x} ${yBase} Z`;

  const activeMonth = hoveredMonth
    ? monthlyData.find((m) => m.month === hoveredMonth)
    : null;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-2 mb-2">
        <div>
          <h4 className="text-xs font-semibold text-slate-100">
            {title || 'Year 1 Monthly Working Capital Liquidity & Inflow/Outflow'}
          </h4>
          <span className="text-[11px] text-slate-400">
            {subtitle || 'Verifies operating cash buffer remains positive throughout first-year ramp'}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-slate-300">Inflows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-400"></span>
            <span className="text-slate-300">Outflows</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400"></span>
            <span className="text-amber-400 font-semibold">Ending Cash Balance</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Grid lines */}
          {[0, 0.33, 0.66, 1.0].map((ratio, idx) => {
            const y = yBase - ratio * chartHeight;
            return (
              <line
                key={idx}
                x1={paddingLeft}
                y1={y}
                x2={svgWidth - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Ending Cash Balance Area Gradient */}
          <defs>
            <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#cashGrad)" />

          {/* Monthly Inflow & Outflow Bars */}
          {monthlyData.map((m, idx) => {
            const x = paddingLeft + idx * monthWidth;
            const isHovered = hoveredMonth === m.month;

            const hIn = Math.max(2, (m.cashInflow / maxInflow) * (chartHeight * 0.75));
            const hOut = Math.max(2, (m.cashOutflow / maxInflow) * (chartHeight * 0.75));

            return (
              <g
                key={m.month}
                onMouseEnter={() => setHoveredMonth(m.month)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="cursor-pointer"
              >
                {/* Hover back column */}
                <rect
                  x={x + 1}
                  y={paddingTop}
                  width={monthWidth - 2}
                  height={chartHeight}
                  fill={isHovered ? '#1e293b' : 'transparent'}
                  opacity={0.5}
                />

                {/* Inflow Bar */}
                <rect
                  x={x + monthWidth * 0.15}
                  y={yBase - hIn}
                  width={barWidth}
                  height={hIn}
                  fill="#10b981"
                  rx="1.5"
                  opacity={isHovered ? 1 : 0.8}
                />

                {/* Outflow Bar */}
                <rect
                  x={x + monthWidth * 0.15 + barWidth + 2}
                  y={yBase - hOut}
                  width={barWidth}
                  height={hOut}
                  fill="#f43f5e"
                  rx="1.5"
                  opacity={isHovered ? 1 : 0.8}
                />

                {/* Month label */}
                <text
                  x={x + monthWidth / 2}
                  y={yBase + 16}
                  textAnchor="middle"
                  fill={isHovered ? '#f59e0b' : '#64748b'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  M{m.month}
                </text>
              </g>
            );
          })}

          {/* Cash Balance Line & Points */}
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {cashPoints.map((p) => {
            const isHovered = hoveredMonth === p.data.month;
            return (
              <circle
                key={p.data.month}
                cx={p.x}
                cy={p.y}
                r={isHovered ? 5 : 3}
                fill="#0b0f17"
                stroke="#f59e0b"
                strokeWidth={isHovered ? 3 : 2}
              />
            );
          })}
        </svg>

        {/* Hover details */}
        {activeMonth && (
          <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-200">
            <span className="font-bold text-amber-400 font-mono">
              Month {activeMonth.month} Breakdown:
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>
                Inflow: <strong className="text-emerald-400">{formatPlanCurrency(activeMonth.cashInflow, currency)}</strong>
              </span>
              <span>
                Outflow: <strong className="text-rose-400">{formatPlanCurrency(activeMonth.cashOutflow, currency)}</strong>
              </span>
              <span>
                Debt: <strong className="text-slate-300">{formatPlanCurrency(activeMonth.debtService, currency)}</strong>
              </span>
              <span>
                Ending Cash: <strong className="text-amber-400">{formatPlanCurrency(activeMonth.endingCash, currency)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
