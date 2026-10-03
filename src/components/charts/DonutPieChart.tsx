import React, { useState } from 'react';
import { formatPlanCurrency } from '../../utils/currency';

export interface PieSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface DonutPieChartProps {
  title: string;
  subtitle?: string;
  slices: PieSlice[];
  currency?: string;
  height?: number;
}

export const DonutPieChart: React.FC<DonutPieChartProps> = ({
  title,
  subtitle,
  slices,
  currency = 'USD',
  height = 240,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0);

  // SVG Geometry
  const size = 200;
  const center = size / 2;
  const radius = 76;
  const innerRadius = 48; // Donut hole

  // Compute slice arcs
  let accumulatedAngle = -90; // Start at top (12 o'clock)
  const paths = slices.map((slice) => {
    const value = Math.max(0, slice.value);
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = total > 0 ? (value / total) * 360 : 0;

    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle = endAngle;

    // Convert polar to cartesian
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const d = total <= 0 || angle <= 0
      ? ''
      : angle >= 359.99
      ? `M ${center - radius} ${center} A ${radius} ${radius} 0 1 0 ${center + radius} ${center} A ${radius} ${radius} 0 1 0 ${center - radius} ${center} M ${center - innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center + innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center - innerRadius} ${center} Z`
      : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

    return {
      ...slice,
      d,
      percentage,
      angle,
    };
  });

  const activeSlice = hoveredId ? slices.find((s) => s.id === hoveredId) : null;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col justify-between h-full">
      <div className="border-b border-slate-800/80 pb-2 mb-3">
        <h4 className="text-xs font-semibold text-slate-100 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[11px] font-mono text-slate-400">
            {formatPlanCurrency(total, currency)}
          </span>
        </h4>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 my-auto">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            {paths.map((p) => {
              const isHovered = hoveredId === p.id;
              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={p.color}
                  opacity={hoveredId ? (isHovered ? 1 : 0.45) : 0.9}
                  stroke="#0b0f17"
                  strokeWidth="2"
                  className="transition-all duration-200 cursor-pointer hover:opacity-100"
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              );
            })}
          </svg>

          {/* Center Hole Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            {activeSlice ? (
              <>
                <span className="text-[10px] font-mono text-slate-400 uppercase truncate max-w-[85px]">
                  {activeSlice.label}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono tabular-nums leading-tight">
                  {total > 0 ? ((activeSlice.value / total) * 100).toFixed(1) : 0}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Total</span>
                <span className="text-xs font-bold text-slate-100 font-mono tabular-nums leading-tight">
                  {formatPlanCurrency(total, currency)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
          {paths.map((p) => {
            const isHovered = hoveredId === p.id;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer ${
                  isHovered ? 'bg-slate-800/80 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  ></span>
                  <span className="truncate text-[11px] font-medium">{p.label}</span>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px]">
                  <span className="text-slate-200 tabular-nums">
                    {formatPlanCurrency(p.value, currency)}
                  </span>
                  <span className="text-slate-400 ml-1.5 tabular-nums text-[10px]">
                    ({p.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
