/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ThreadRisk, ThreatSeverity } from "../types";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ThumbsDown,
  Lock,
  MessageSquare,
  Skull,
  UserCheck,
  ChevronRight,
  TrendingDown,
  Flame,
  ArrowRight
} from "lucide-react";
import { ThreatBadge } from "./Visuals";

interface ThreadRiskProps {
  threads: ThreadRisk[];
  onTriageAction: (threadId: string, actionType: string, reason: string) => void;
}

export const ThreadRiskLedger: React.FC<ThreadRiskProps> = ({ threads, onTriageAction }) => {
  const [selectedThread, setSelectedThread] = useState<ThreadRisk | null>(threads[0] || null);
  const [hoveredTimelineIndex, setHoveredTimelineIndex] = useState<number | null>(null);

  // SVG grid timeline metrics
  const plotWidth = 380;
  const plotHeight = 100;

  const currentThread = selectedThread
    ? threads.find(t => t.id === selectedThread.id) || selectedThread
    : null;

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="border-b border-zinc-805 pb-4">
        <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
          Thread Risk Ledger
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Monitor discussion velocity, sentiment analysis, and risk metrics generated for active posts.
        </p>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Thread risks table index (Left side) */}
        <div className="col-span-1 lg:col-span-7 bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/20 font-mono text-[10px] text-zinc-500 uppercase font-bold">
            Tracked Discussions
          </div>
          <div className="divide-y divide-zinc-850">
            {threads.map((thread) => {
              const isSelected = currentThread?.id === thread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition select-none ${
                    isSelected ? "bg-rose-500/5 border-l-2 border-rose-500" : "hover:bg-zinc-850/30"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-400">[{thread.id}]</span>
                      <span className="font-medium text-xs text-zinc-100 truncate flex-1 block">
                        {thread.title}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-rose-500 uppercase truncate">
                      {thread.narrativeVector}
                    </p>
                    <div className="flex items-center gap-3 text-[9.5px] font-sans text-zinc-500">
                      <span>u/{thread.author}</span>
                      <span>•</span>
                      <span>{thread.commentCount} Comments</span>
                      <span>•</span>
                      <span className={`${thread.upvoteRatio < 0.6 ? "text-amber-500 font-bold" : ""}`}>
                        {Math.floor(thread.upvoteRatio * 100)}% Upvoted
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[9px] text-zinc-500 block">Risk Score</span>
                      <span className={`text-sm font-bold block ${
                        thread.riskScore > 75 ? "text-red-500" : thread.riskScore > 50 ? "text-amber-500" : "text-emerald-500"
                      }`}>
                        {thread.riskScore}%
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Thread Telemetry Panel (Right side) */}
        <div className="col-span-1 lg:col-span-5 space-y-4 font-mono">
          {currentThread ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
              
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-[9px] text-zinc-500 block">Thread Telemetry</span>
                  <span className="text-xs font-bold text-zinc-300 block mt-0.5">{currentThread.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentThread.status === "NORMAL" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40" :
                    currentThread.status === "WATCH" ? "bg-amber-950/40 text-amber-400 border border-amber-800/40" :
                    "bg-rose-950/40 text-rose-400 border border-rose-800/40 animate-pulse"
                  }`}>
                    {currentThread.status}
                  </span>
                  <ThreatBadge level={currentThread.threatLevel} />
                </div>
              </div>

              {/* Title reference */}
              <div className="space-y-1.5 font-sans">
                <span className="text-[9px] text-zinc-500 block uppercase font-semibold">Associated Focus Topic</span>
                <p className="text-xs text-rose-450 font-bold font-semibold uppercase leading-snug font-mono">
                  {currentThread.narrativeVector}
                </p>
                <p className="text-[11px] text-zinc-300 leading-normal bg-zinc-950/40 p-3 rounded border border-zinc-850 mt-1">
                  {currentThread.title}
                </p>
              </div>

              {/* Advanced Risk indicators list */}
              <div className="space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase block font-sans">Risk Indicators</span>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  
                  {/* Sent trend */}
                  <div className="p-3 bg-zinc-950/50 rounded border border-zinc-850 flex flex-col justify-between h-14 font-sans">
                    <span className="text-zinc-500">Sentiment Trend</span>
                    <span className={`font-bold mt-1 text-xs block flex items-center gap-1 ${
                      currentThread.indicators.sentimentTrend === "PLUMMETING" ? "text-red-500" : "text-amber-500"
                    }`}>
                      <TrendingDown className="w-3.5 h-3.5" />
                      {currentThread.indicators.sentimentTrend}
                    </span>
                  </div>

                  {/* Velocity spike alert */}
                  <div className="p-3 bg-zinc-950/50 rounded border border-zinc-850 flex flex-col justify-between h-14 font-sans">
                    <span className="text-zinc-500">Post Velocity</span>
                    <span className={`font-bold text-xs mt-1 block flex items-center gap-1 ${
                      currentThread.indicators.velocitySpike ? "text-rose-500" : "text-emerald-500"
                    }`}>
                      <Flame className="w-3.5 h-3.5" />
                      {currentThread.indicators.velocitySpike ? "Rapid Spike" : "Steady"}
                    </span>
                  </div>

                  {/* Non member participation (Brigade audit) */}
                  <div className="p-3 bg-zinc-950/50 rounded border border-zinc-850 flex flex-col justify-between h-14 font-sans">
                    <span className="text-zinc-500">Non-Subscribers</span>
                    <span className={`font-bold text-xs mt-1 block ${
                      currentThread.indicators.nonMemberParticipationRate > 50 ? "text-red-500" : "text-zinc-300"
                    }`}>
                      {currentThread.indicators.nonMemberParticipationRate}%
                    </span>
                  </div>

                  {/* Cross platform links */}
                  <div className="p-3 bg-zinc-950/50 rounded border border-zinc-850 flex flex-col justify-between h-14 font-sans">
                    <span className="text-zinc-500">External Mentions</span>
                    <span className="text-zinc-350 font-bold text-xs mt-1 block">
                      {currentThread.indicators.crossPostCount} links
                    </span>
                  </div>

                </div>
              </div>

              {/* Kinetic propagation timeline chart (SVG) */}
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                  <span>KINETIC PROPAGATION CURVE</span>
                  {hoveredTimelineIndex !== null ? (
                    <span className="text-rose-450 font-bold animate-pulse text-[10px] bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
                      Tox: {currentThread.timelineData[hoveredTimelineIndex].toxicity_level}% | Vol: {currentThread.timelineData[hoveredTimelineIndex].comment_velocity}/m @ {currentThread.timelineData[hoveredTimelineIndex].time}
                    </span>
                  ) : (
                    <span className="text-zinc-600">Hover graph to trace telemetry</span>
                  )}
                </div>
                
                <div className="bg-zinc-950 p-3 rounded border border-zinc-850 h-32 flex flex-col justify-between transition-all">
                  <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="w-full h-full overflow-visible">
                    {/* Horizontal helper refs */}
                    <line x1="0" y1={plotHeight * 0.25} x2={plotWidth} y2={plotHeight * 0.25} className="stroke-zinc-900" strokeDasharray="3 3"/>
                    <line x1="0" y1={plotHeight * 0.75} x2={plotWidth} y2={plotHeight * 0.75} className="stroke-zinc-900" strokeDasharray="3 3"/>
                    
                    {/* Vertical Guideline on Hover */}
                    {hoveredTimelineIndex !== null && (() => {
                      const x = (hoveredTimelineIndex / (currentThread.timelineData.length - 1)) * plotWidth;
                      const point = currentThread.timelineData[hoveredTimelineIndex];
                      const yTox = plotHeight - (point.toxicity_level / 100) * (plotHeight - 15) - 5;
                      return (
                        <g className="pointer-events-none">
                          <line
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={plotHeight}
                            className="stroke-rose-500/25"
                            strokeDasharray="2 2"
                            strokeWidth="1"
                          />
                          <circle
                            cx={x}
                            cy={yTox}
                            r="6"
                            className="fill-rose-500/15 stroke-rose-400/40 stroke-[0.8] animate-ping"
                          />
                        </g>
                      );
                    })()}

                    {/* Area under curve - comment velocity */}
                    <path
                      d={`M 0,${plotHeight} ` + currentThread.timelineData.map((t, i) => {
                        const x = (i / (currentThread.timelineData.length - 1)) * plotWidth;
                        // normalize velocity
                        const maxVelocity = Math.max(...currentThread.timelineData.map(td => td.comment_velocity), 100);
                        const y = plotHeight - (t.comment_velocity / maxVelocity) * (plotHeight - 15) - 5;
                        return `L ${x},${y}`;
                      }).join(" ") + ` L ${plotWidth},${plotHeight} Z`}
                      className="fill-blue-500/10"
                    />

                    {/* Toxicity line overlay (Red) */}
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      points={currentThread.timelineData.map((t, i) => {
                        const x = (i / (currentThread.timelineData.length - 1)) * plotWidth;
                        const y = plotHeight - (t.toxicity_level / 100) * (plotHeight - 15) - 5;
                        return `${x},${y}`;
                      }).join(" ")}
                      className="stroke-rose-500"
                    />

                    {/* Nodes on points */}
                    {currentThread.timelineData.map((t, i) => {
                      const x = (i / (currentThread.timelineData.length - 1)) * plotWidth;
                      const y = plotHeight - (t.toxicity_level / 100) * (plotHeight - 15) - 5;
                      const isActive = i === hoveredTimelineIndex;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={isActive ? "4" : "2"}
                          className={`stroke-zinc-950 transition-all ${
                            isActive ? "fill-rose-400 stroke-2" : "fill-rose-500 stroke-1"
                          }`}
                        />
                      );
                    })}

                    {/* Invisible hover-tracking columns */}
                    {currentThread.timelineData.map((_t, idx) => {
                      const sliceWidth = plotWidth / (currentThread.timelineData.length - 1);
                      const xStart = (idx - 0.5) * sliceWidth;
                      const xEnd = (idx + 0.5) * sliceWidth;
                      const left = Math.max(0, xStart);
                      const right = Math.min(plotWidth, xEnd);
                      const w = right - left;

                      return (
                        <rect
                          key={`timeline-slice-${idx}`}
                          x={left}
                          y={0}
                          width={w}
                          height={plotHeight}
                          className="fill-transparent cursor-pointer"
                          onMouseEnter={() => setHoveredTimelineIndex(idx)}
                          onMouseLeave={() => setHoveredTimelineIndex(null)}
                        />
                      );
                    })}
                  </svg>
                  
                  <div className="flex justify-between text-[8px] text-zinc-550 border-t border-zinc-855 pt-1.5 leading-none">
                    {currentThread.timelineData.map((t, i) => (
                      <span 
                        key={i}
                        className={`transition-colors duration-150 ${
                          i === hoveredTimelineIndex ? "text-rose-400 font-bold" : ""
                        }`}
                      >
                        {t.time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick deployment actions */}
              {currentThread.status !== "LOCKED" && currentThread.status !== "FIREWALL_ACTIVE" ? (
                <div className="space-y-2 border-t border-zinc-800 pt-4">
                  <span className="text-[9px] text-zinc-500 uppercase block">INTERVENE_SOCIAL_FIREWALL_OVERLAY</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        onTriageAction(
                          currentThread.id,
                          "LOCK_THREAD",
                          "Mod locked discussion thread due to critical kinetic report surge."
                        )
                      }
                      className="bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 hover:text-white border border-rose-900/30 py-2 rounded text-center transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> LOCK COMMENTARY
                    </button>
                    <button
                      onClick={() =>
                        onTriageAction(
                          currentThread.id,
                          "SLOW_MODE",
                          "Mod deployed Slow Mode rates (15s limits) to cool down narrative spike."
                        )
                      }
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 py-2 rounded text-center transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" /> DEPLOY SLOW MODE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/10 border border-rose-950/30 p-3 rounded-lg text-center font-mono text-[10.5px] text-rose-400 mt-4 leading-relaxed">
                  🛡️ SOCIAL_SHIELDING_DEPLOYED: Firewall protocol currently active. Comments rate limited.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-zinc-90 w-full p-8 text-center text-zinc-500 font-mono text-xs border border-zinc-800 rounded">
              Select any thread to load kinetic metrics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
