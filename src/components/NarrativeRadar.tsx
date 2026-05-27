/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { NarrativeCluster, ThreatSeverity } from "../types";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileText,
  Compass,
  Fingerprint
} from "lucide-react";
import { ThreatBadge } from "./Visuals";

interface NarrativeRadarProps {
  clusters: NarrativeCluster[];
}

export const NarrativeRadar: React.FC<NarrativeRadarProps> = ({ clusters }) => {
  const [selectedCluster, setSelectedCluster] = useState<NarrativeCluster | null>(clusters[0] || null);
  const [hoveredCluster, setHoveredCluster] = useState<NarrativeCluster | null>(null);

  // SVG grid calculations
  const size = 300;
  const center = size / 2;

  // Convert radial/cartesian coordinate bounds (-100 to 100) to SVG viewbox (0 to size)
  const mapCoords = (x: number, y: number) => {
    const scale = (size - 50) / 200; // fit with safe padding
    const svgX = center + x * scale;
    const svgY = center - y * scale; // invert y for standard cartesian
    return { x: svgX, y: svgY };
  };

  const activeCluster = hoveredCluster || selectedCluster;

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="border-b border-zinc-805 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-500 animate-pulse" /> Narrative Radar Map
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Visualization of topical narrative clusters. High-risk, highly coordinated topics sit further up from the baseline, while organic public discussions sit closer to the bottom center.
          </p>
        </div>
        <div className="bg-zinc-950 px-2.5 py-1 rounded border border-zinc-850 font-mono text-[10px] text-zinc-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time sync: Active</span>
        </div>
      </div>

      {/* 🔮 Split Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Radar scope display (Left column) */}
        <div className="col-span-1 lg:col-span-7 w-full flex flex-col items-center p-5 bg-zinc-900 border border-zinc-800 rounded-lg relative overflow-hidden">
          
          {/* Subtle grid indicators */}
          <div className="w-full flex items-center justify-between font-mono text-[9px] text-zinc-500 mb-2 border-b border-zinc-850 pb-2">
            <span className="flex items-center gap-1.5">
              <span className="text-rose-500 font-bold">&#x25C9;</span> Narrative Monitoring Active
            </span>
            <span>Grid Space: -100 to +100</span>
          </div>

          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center border border-zinc-850/80 bg-[#08080a] rounded-full p-4 mt-2 shadow-inner">
            
            {/* SVG radar drawing */}
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Sonar sweep gradient wedge */}
                <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.18" />
                  <stop offset="60%" stopColor="#dc2626" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                </linearGradient>

                {/* Cyber grid pattern */}
                <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#262626" strokeWidth="0.5" strokeOpacity="0.15" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <circle cx={center} cy={center} r={size / 2 - 20} fill="url(#radarGrid)" />

              {/* Concentric Grid Rings */}
              <circle cx={center} cy={center} r={size / 2 - 20} className="stroke-zinc-800/80 fill-transparent" strokeWidth="1" />
              <circle cx={center} cy={center} r={(size / 2 - 20) * 0.75} className="stroke-zinc-850 fill-transparent" strokeWidth="0.8" strokeDasharray="4 4" />
              <circle cx={center} cy={center} r={(size / 2 - 20) * 0.50} className="stroke-zinc-800/50 fill-transparent" strokeWidth="0.8" />
              <circle cx={center} cy={center} r={(size / 2 - 20) * 0.25} className="stroke-zinc-855/60 fill-transparent" strokeWidth="0.8" strokeDasharray="2 2" />
              
              {/* Polar Ticks / Degree Markings */}
              <circle cx={center} cy={center} r={size / 2 - 16} className="stroke-zinc-855/40 fill-transparent" strokeWidth="1" strokeDasharray="1 10" />

              {/* Quadrant cross-hairs */}
              <line x1={15} y1={center} x2={size - 15} y2={center} className="stroke-zinc-800/60" strokeWidth="0.8" />
              <line x1={center} y1={15} x2={center} y2={size - 15} className="stroke-zinc-800/60" strokeWidth="0.8" />

              {/* Diagonal Sectors Divider Lines */}
              <line x1={center - (size/2 - 20) * 0.707} y1={center - (size/2 - 20) * 0.707} x2={center + (size/2 - 20) * 0.707} y2={center + (size/2 - 20) * 0.707} className="stroke-zinc-855/40" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={center - (size/2 - 20) * 0.707} y1={center + (size/2 - 20) * 0.707} x2={center + (size/2 - 20) * 0.707} y2={center - (size/2 - 20) * 0.707} className="stroke-zinc-855/40" strokeWidth="0.5" strokeDasharray="3 3" />
              
              {/* Sector Axis Labeling */}
              <text x={center} y={12} className="fill-zinc-600 font-mono text-[7px]" textAnchor="middle">High Coordination (+Y)</text>
              <text x={center} y={size - 4} className="fill-zinc-600 font-mono text-[7px]" textAnchor="middle">Organic Activity (-Y)</text>
              <text x={size - 5} y={center + 3} className="fill-zinc-600 font-mono text-[7px] transform rotate-90 origin-center" textAnchor="middle">Spreading (+X)</text>
              <text x={18} y={center + 3} className="fill-zinc-600 font-mono text-[7px] transform -rotate-90 origin-center" textAnchor="middle">Isolated Bubbles (-X)</text>
              
              {/* Connected Astroturfing Constellation Web */}
              {clusters.map((c, idx) => {
                const node = mapCoords(c.radarX, c.radarY);
                return clusters.slice(idx + 1).map((other, oIdx) => {
                  const otherNode = mapCoords(other.radarX, other.radarY);
                  // Calculate distance
                  const dx = node.x - otherNode.x;
                  const dy = node.y - otherNode.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  // Dynamic path connecting rules close to each other
                  if (dist < 180) {
                    return (
                      <line
                        key={`${idx}-${oIdx}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        className="stroke-rose-500/10"
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                      />
                    );
                  }
                  return null;
                });
              })}

              {/* Sonar Rotating Sweep Element */}
              <g className="animate-[spin_7s_linear_infinite]" style={{ transformOrigin: "150px 150px" }}>
                <path
                  d={`M ${center} ${center} L ${center} 20 A ${size / 2 - 20} ${size / 2 - 20} 0 0 1 ${center + (size/2 - 20) * 0.866} ${center - (size/2 - 20) * 0.5} Z`}
                  fill="url(#sweepGrad)"
                  className="pointer-events-none"
                />
              </g>

              {/* Dynamic Target Bearing Lock Line for Active Node */}
              {activeCluster && (() => {
                const pos = mapCoords(activeCluster.radarX, activeCluster.radarY);
                return (
                  <g className="pointer-events-none">
                    <line
                      x1={center}
                      y1={center}
                      x2={pos.x}
                      y2={pos.y}
                      className="stroke-rose-500/25"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                    {/* Ring locator on grid center */}
                    <circle cx={center} cy={center} r="3" className="fill-rose-500" />
                  </g>
                );
              })()}

              {/* Draw Cluster Node targets */}
              {clusters.map((cluster) => {
                const pos = mapCoords(cluster.radarX, cluster.radarY);
                const isSelected = selectedCluster?.id === cluster.id;
                const isHovered = hoveredCluster?.id === cluster.id;
                const isActive = isSelected || isHovered;
                
                // Set node color by threat level
                let colorClass = "fill-emerald-400 stroke-emerald-500";
                let textClass = "fill-emerald-400 font-bold";
                let rawColor = "#10B981";
                if (cluster.threatLevel === ThreatSeverity.CRITICAL) {
                  colorClass = "fill-rose-500 stroke-rose-600";
                  textClass = "fill-rose-500 font-bold";
                  rawColor = "#FF2E93";
                } else if (cluster.threatLevel === ThreatSeverity.HIGH) {
                  colorClass = "fill-orange-400 stroke-orange-550";
                  textClass = "fill-orange-400 font-bold";
                  rawColor = "#F97316";
                } else if (cluster.threatLevel === ThreatSeverity.MEDIUM) {
                  colorClass = "fill-blue-400 stroke-blue-500";
                  textClass = "fill-blue-400 font-bold";
                  rawColor = "#3B82F6";
                }

                return (
                  <g 
                    key={cluster.id} 
                    className="cursor-pointer" 
                    onClick={() => setSelectedCluster(cluster)}
                    onMouseEnter={() => setHoveredCluster(cluster)}
                    onMouseLeave={() => setHoveredCluster(null)}
                  >
                    {/* Tactical Bracket Crosshair Target Frame when hovered or selected */}
                    {isActive && (
                      <g className="transition-all duration-300">
                        {/* Interactive sonar waves radiating outward */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="16"
                          className="fill-transparent stroke-rose-500 stroke-[0.8] animate-ping opacity-45"
                          style={{ animationDuration: "1.8s" }}
                        />
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="10"
                          className="fill-transparent stroke-rose-450 stroke-[0.5] opacity-60"
                        />
                        {/* Four corner bracket markers */}
                        <path
                          d={`M ${pos.x - 9} ${pos.y - 5} L ${pos.x - 9} ${pos.y - 9} L ${pos.x - 5} ${pos.y - 9}`}
                          fill="none"
                          stroke={rawColor}
                          strokeWidth="1"
                        />
                        <path
                          d={`M ${pos.x + 9} ${pos.y - 5} L ${pos.x + 9} ${pos.y - 9} L ${pos.x + 5} ${pos.y - 9}`}
                          fill="none"
                          stroke={rawColor}
                          strokeWidth="1"
                        />
                        <path
                          d={`M ${pos.x - 9} ${pos.y + 5} L ${pos.x - 9} ${pos.y + 9} L ${pos.x - 5} ${pos.y + 9}`}
                          fill="none"
                          stroke={rawColor}
                          strokeWidth="1"
                        />
                        <path
                          d={`M ${pos.x + 9} ${pos.y + 5} L ${pos.x + 9} ${pos.y + 9} L ${pos.x + 5} ${pos.y + 9}`}
                          fill="none"
                          stroke={rawColor}
                          strokeWidth="1"
                        />
                      </g>
                    )}
                    
                    {/* Core node dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? "7.5" : "5.5"}
                      className={`${colorClass} stroke-[2.5px] transition-all duration-300`}
                      style={{
                        filter: isActive ? `drop-shadow(0 0 6px ${rawColor})` : "none",
                      }}
                    />

                    {/* Numeric coordinate index tag */}
                    <text
                      x={pos.x}
                      y={pos.y - (isActive ? 13 : 10)}
                      className={`font-mono text-[9px] ${isActive ? "fill-white font-black" : "fill-zinc-400"} select-none pointer-events-none`}
                      textAnchor="middle"
                    >
                      {cluster.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick list of clusters inside scope */}
          <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {clusters.map((c) => {
              const matchesSelected = selectedCluster?.id === c.id;
              const matchesHovered = hoveredCluster?.id === c.id;
              
              let borderCol = "border-zinc-800";
              let textCol = "text-zinc-500 hover:text-zinc-300";
              let bgStyle = "bg-zinc-950/60";

              if (matchesSelected) {
                borderCol = "border-rose-500/50";
                textCol = "text-rose-450 font-bold";
                bgStyle = "bg-rose-500/[0.08]";
              } else if (matchesHovered) {
                borderCol = "border-rose-500/25";
                textCol = "text-zinc-200";
                bgStyle = "bg-zinc-850/60";
              }

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCluster(c)}
                  onMouseEnter={() => setHoveredCluster(c)}
                  onMouseLeave={() => setHoveredCluster(null)}
                  className={`p-3 rounded border text-left flex flex-col justify-between font-mono text-[10.5px] select-none transition cursor-pointer leading-tight ${bgStyle} ${borderCol} ${textCol}`}
                >
                  <span className="font-bold truncate text-xs shrink-0 block">
                    {c.id}: {c.name.slice(0, 15)}...
                  </span>
                  <div className="flex items-center justify-between mt-2 text-[9px] text-zinc-500">
                    <span>+{c.growthRate}% Vel</span>
                    <span>Entropy: {c.sourcesEntropy.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Cluster Details Panel (Right column) */}
        <div className="col-span-1 lg:col-span-5 space-y-4">
          {selectedCluster ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-550 block">Narrative Details</span>
                  <h2 className="text-[15px] font-bold text-zinc-100 block mt-1 leading-snug">
                    {selectedCluster.name}
                  </h2>
                </div>
                <ThreatBadge level={selectedCluster.threatLevel} />
              </div>

              {/* Dynamic Coordinate Radar Telemetry Feed */}
              <div className="border border-zinc-805 rounded p-2.5 bg-zinc-950/90 font-mono text-[10px] space-y-1">
                <div className="flex justify-between text-zinc-500">
                  <span>Behavior Sector:</span>
                  <span className="text-zinc-300 font-semibold">
                    {selectedCluster.radarY > 20
                      ? "Coordinated Campaign"
                      : selectedCluster.radarY < -20
                      ? "Organic public discussion"
                      : "General Community Topics"}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Vector X Coordinate:</span>
                  <span className="text-zinc-350">{selectedCluster.radarX.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Vector Y Coordinate:</span>
                  <span className="text-zinc-350">{selectedCluster.radarY.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Bearing Angle:</span>
                  <span className="text-rose-455 font-bold">
                    {(
                      (Math.atan2(selectedCluster.radarX, selectedCluster.radarY) * 180) / Math.PI +
                      360
                    ).toFixed(1)}&deg;
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Description</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1 p-3 bg-[#0c0c0e] rounded border border-zinc-850">
                  {selectedCluster.description}
                </p>
              </div>

              {/* Semantic stats index metrics */}
              <div className="grid grid-cols-2 gap-3 font-mono text-[10.5px] bg-[#0c0c0e] p-3 rounded border border-zinc-850">
                <div>
                  <span className="text-zinc-500 block">Post Density</span>
                  <span className="text-zinc-200 block font-bold mt-0.5">
                    {selectedCluster.postCount} posts / {selectedCluster.commentCount} replies
                  </span>
                </div>
                <div>
                  <span className="text-zinc-550 block">Detected At</span>
                  <span className="text-zinc-200 block mt-0.5">
                    {new Date(selectedCluster.detectedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="border-t border-zinc-850 pt-2 mt-2">
                  <span className="text-zinc-500 block">Unique Users</span>
                  <span className="text-zinc-200 block font-bold mt-0.5">
                    {selectedCluster.sourcesCount} accounts
                  </span>
                </div>
                <div className="border-t border-zinc-850 pt-2 mt-2">
                  <span className="text-zinc-500 flex items-center gap-1 font-semibold">
                    <Fingerprint className="w-3.5 h-3.5" /> Sentiment Structure
                  </span>
                  <span className={`font-bold mt-0.5 block ${
                    selectedCluster.sourcesEntropy < 0.2 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {selectedCluster.sourcesEntropy.toFixed(2)} ({
                    selectedCluster.sourcesEntropy < 0.2 ? "Highly Concentrated" : "Organic"
                  })
                  </span>
                </div>
              </div>

              {/* Extracted key quote triggers */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                  <FileText className="w-4 h-4 text-rose-500" /> Key Sentences Traced
                </span>
                <div className="space-y-2">
                  {selectedCluster.keySentences.map((sentence, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950 px-3.5 py-2.5 rounded border border-zinc-900 text-[11px] font-mono text-zinc-400 leading-normal pl-4 border-l-2 border-l-rose-500/60"
                    >
                      &ldquo;{sentence}&rdquo;
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-90 w-full p-8 text-center text-zinc-500 font-mono text-xs border border-zinc-800 rounded">
              Select any coordinate marker on the Narrative Scope mapping grid on the left to review metrics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
