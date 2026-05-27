/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DashboardMetrics, SubredditPolicy } from "../types";

interface PolicyPieChartProps {
  metrics: DashboardMetrics;
  policies: SubredditPolicy[];
}

interface Point {
  x: number;
  y: number;
}

// Fun, extremely vibrant modern colors for policy segments
const FUN_COLORS = [
  "#ec4899", // Neon Hot Pink
  "#06b6d4", // Electric Bright Aqua
  "#f59e0b", // Warm Solar Gold
  "#10b981", // Vibrant Mint Green
  "#a855f7", // Intense Orchid Purple
  "#f43f5e", // Punchy Rose Pink
];

export const PolicyPieChart: React.FC<PolicyPieChartProps> = ({ metrics, policies }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Filter and map to active rule distributions
  const data = metrics.distributionByRule
    .map((item, idx) => {
      const policy = policies.find((p) => p.id === item.ruleId);
      return {
        ruleId: item.ruleId,
        count: item.count,
        name: policy ? policy.name : `Rule ID: ${item.ruleId}`,
        ruleNumber: policy ? policy.ruleNumber : idx + 1,
        color: FUN_COLORS[idx % FUN_COLORS.length],
      };
    })
    .filter((d) => d.count > 0);

  const totalFlagged = data.reduce((acc, curr) => acc + curr.count, 0);

  const getCoordinatesForPercent = (percent: number, radius: number, cx: number, cy: number): Point => {
    // Offset by -90 degrees (Math.PI / 2) to start at top center
    const angle = percent * 2 * Math.PI - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return { x, y };
  };

  // Generate paths for donut slices
  let accumulatedPercent = 0;
  const slices = data.map((item, idx) => {
    const percent = totalFlagged > 0 ? item.count / totalFlagged : 0;
    const p0 = accumulatedPercent;
    const p1 = Math.min(accumulatedPercent + percent, 0.9999); // Prevent overlap if exactly 100%
    accumulatedPercent += percent;

    const cx = 110;
    const cy = 110;
    
    const isHovered = hoveredIdx === idx;
    const R = isHovered ? 92 : 84; // Outer radius pushes outer-wards on hover
    const r = isHovered ? 52 : 58; // Inner radius pushes inner-wards on hover

    const startOuter = getCoordinatesForPercent(p0, R, cx, cy);
    const endOuter = getCoordinatesForPercent(p1, R, cx, cy);
    const startInner = getCoordinatesForPercent(p0, r, cx, cy);
    const endInner = getCoordinatesForPercent(p1, r, cx, cy);

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    // Draw slice: Outer sweep (clockwise), Line to inner, Inner sweep (counter-clockwise), close.
    const pathData = `
      M ${startOuter.x} ${startOuter.y}
      A ${R} ${R} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${endInner.x} ${endInner.y}
      A ${r} ${r} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
      Z
    `.trim();

    return {
      ...item,
      pathData,
      percent,
      index: idx,
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono space-y-4">
      {/* Container Header */}
      <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
        <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold font-sans">
          Incidents by Rule Criteria
        </span>
        <span className="text-[9.5px] bg-zinc-800 text-zinc-300 font-bold px-1.5 py-0.5 rounded border border-zinc-700 font-sans">
          Proportions
        </span>
      </div>

      {/* Visual Workspace Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Col: Donut Pie Visual Representation (5 Cols) */}
        <div className="col-span-1 md:col-span-5 flex justify-center relative select-none">
          <div className="relative w-[220px] h-[220px]">
            <svg
              viewBox="0 0 220 220"
              className="w-full h-full transform transition-all duration-300"
            >
              {slices.map((slice, idx) => (
                <path
                  key={slice.ruleId}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all duration-300 cursor-pointer origin-center"
                  style={{
                    filter: hoveredIdx === idx ? `drop-shadow(0 0 12px ${slice.color}60)` : "none",
                    opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.45,
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}

              {/* Sub-center helper circle for visual clarity */}
              <circle cx="110" cy="110" r="48" fill="#0A0A0B" />
            </svg>

            {/* Central dynamic indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 leading-tight">
              {activeSlice ? (
                <>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    RULE_{activeSlice.ruleNumber}
                  </span>
                  <span
                    className="text-lg font-black mt-0.5"
                    style={{ color: activeSlice.color }}
                  >
                    {activeSlice.count}
                  </span>
                  <span className="text-[8.5px] text-zinc-400 mt-0.5 font-bold">
                    {(activeSlice.percent * 100).toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                    TOTAL FLAGS
                  </span>
                  <span className="text-xl font-black text-white mt-1">
                    {totalFlagged}
                  </span>
                  <span className="text-[8.5px] text-zinc-400 mt-1 font-semibold uppercase">
                    MOD_ALERTS
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Smart Interactive Legends (7 Cols) */}
        <div className="col-span-1 md:col-span-7 space-y-2.5">
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={slice.ruleId}
                className={`p-2.5 rounded border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isHovered
                    ? "bg-zinc-850/90 border-zinc-700 shadow-md scale-[1.01]"
                    : "bg-zinc-950/40 border-zinc-850 hover:bg-zinc-850/40 hover:border-zinc-800"
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Rule bullet + Name */}
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {/* Neon Color Indicator Tag */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: slice.color,
                      boxShadow: isHovered ? `0 0 8px ${slice.color}` : "none",
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                  <div className="truncate text-[11px] leading-tight font-medium">
                    <span className="text-zinc-500 mr-1 font-bold">
                      R{slice.ruleNumber}:
                    </span>
                    <span className={isHovered ? "text-zinc-100" : "text-zinc-300"}>
                      {slice.name}
                    </span>
                  </div>
                </div>

                {/* Counts breakdown */}
                <div className="shrink-0 text-right font-mono text-[10.5px]">
                  <span className="text-zinc-200 font-bold">{slice.count} flags</span>
                  <span className="text-zinc-500 ml-1.5 font-bold">
                    ({(slice.percent * 100).toFixed(1)}%)
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
