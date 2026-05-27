/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Incident,
  NarrativeCluster,
  DashboardMetrics,
  ThreatSeverity
} from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Timer,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Scale
} from "lucide-react";
import { ThreatBadge, ActionBadge, ScoreRing } from "./Visuals";

interface OverviewProps {
  incidents: Incident[];
  clusters: NarrativeCluster[];
  metrics: DashboardMetrics;
  onTriageAction: (incidentId: string, action: string, reason: string) => void;
  onNavigateToView: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  incidents,
  clusters,
  metrics,
  onTriageAction,
  onNavigateToView
}) => {
  // Live hover state for spot metrics details
  const [hoveredSaveIndex, setHoveredSaveIndex] = React.useState<number | null>(null);

  // Filter for immediate threats needing triage
  const highRiskIncidents = incidents.filter(
    inc => inc.threatLevel === ThreatSeverity.CRITICAL || inc.status === "PENDING"
  ).slice(0, 2);

  // Get active narrative clusters sorted by growth rate
  const hotClusters = [...clusters].sort((a, b) => b.growthRate - a.growthRate).slice(0, 3);

  // SVG dimensions for the historical trend graph
  const plotWidth = 500;
  const plotHeight = 120;
  const savings = metrics.historicalSavings;
  const maxIncidents = Math.max(...savings.map(s => s.incidentsBlocked), 10);

  // Generate SVG path for blocked incidents trend
  let trendPoints = "";
  if (savings.length > 1) {
    trendPoints = savings
      .map((s, idx) => {
        const x = (idx / (savings.length - 1)) * plotWidth;
        const y = plotHeight - (s.incidentsBlocked / maxIncidents) * (plotHeight - 15) - 10;
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 🔮 Dashboard Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-5 rounded-lg border border-zinc-800">
        <div>
          <h1 className="text-xl md:text-2xl font-mono font-black tracking-tight text-white uppercase flex items-center gap-2">
            Subreddit Overview
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Analyzing subreddit narratives, coordination vectors, and automated filters in r/WorldTech.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Monitoring active thread feeds for rule compliance
        </div>
      </div>

      {/* 📊 Quantitative Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Core Blocked */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <ShieldAlert className="w-12 h-12 text-rose-500" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Flagged Incidents</span>
          <p className="text-2xl md:text-3xl font-black text-rose-500 mt-1">{metrics.incidentsFlagged}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2">
            <span className="text-rose-400 font-bold">Pre-filtered</span> via safe rules
          </div>
        </div>

        {/* Saved Labor */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Scale className="w-12 h-12 text-emerald-500" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Labor Saved</span>
          <p className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">{metrics.estimatedHoursSaved.toFixed(1)} hrs</p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2">
            <span className="text-emerald-400 font-bold">~24m</span> avg saved per review
          </div>
        </div>

        {/* Stable Threads */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <ShieldCheck className="w-12 h-12 text-blue-500" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Stabilized Threads</span>
          <p className="text-2xl md:text-3xl font-black text-blue-400 mt-1">{metrics.threadsStabilized}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2">
            <span className="text-blue-400 font-bold">Active shielding</span> in progress
          </div>
        </div>

        {/* Avg Latency */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
            <Zap className="w-12 h-12 text-amber-500" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Response Time</span>
          <p className="text-2xl md:text-3xl font-black text-amber-400 mt-1">{metrics.avgResponseTimeMs} ms</p>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-2">
            <span className="text-amber-400 font-bold">Sub-second</span> average intercept
          </div>
        </div>
      </div>

      {/* 🚨 Immediate Action Triage Center */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-rose-500 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
            Critical Incidents Queue ({highRiskIncidents.filter(i=>i.status==="PENDING").length})
          </h2>
          <button
            onClick={() => onNavigateToView("INCIDENTS")}
            className="text-xs font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            Open Full Ledger <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {highRiskIncidents.filter(i=>i.status==="PENDING").length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-8 text-center font-mono text-xs text-zinc-500">
            ❇️ Subreddit Stable: No pending critical incidents. Monitoring comments and posts.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {highRiskIncidents.filter(i=>i.status==="PENDING").map((incident) => (
              <div
                key={incident.id}
                className="bg-zinc-900 border border-rose-950/40 rounded-lg p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Visual heat gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />
                
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-800/50 pb-2">
                    <span className="font-mono text-[10px] text-zinc-500">{incident.id} • Posted by u/{incident.author}</span>
                    <ThreatBadge level={incident.threatLevel} />
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-zinc-100 hover:text-rose-400 transition truncate">
                      {incident.threadTitle}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed font-mono bg-zinc-950/50 p-3 rounded border border-zinc-850">
                      &ldquo;{incident.contentSnippet}&rdquo;
                    </p>
                  </div>

                  {/* Threat analysis overlay */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-rose-950/10 border border-rose-950/20 rounded font-mono text-[10px]">
                    <div>
                      <span className="text-zinc-550 block uppercase font-bold text-[9px]">Violation Type</span>
                      <span className="text-rose-400 font-bold uppercase block">
                        Rule Match {incident.violatesRuleId ? "Detected" : "General"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-550 block uppercase font-bold text-[9px]">Brigade Likelihood</span>
                      <span className="text-rose-400 font-bold block">{incident.brigadeProbability}% Probability</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-zinc-950 border border-zinc-800 rounded">
                    <span className="text-[10px] font-mono text-zinc-500 h-4 block">RECOMMENDED ACTION</span>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <ActionBadge action={incident.recommendedAction.type} />
                      <span className="text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                        {Math.floor(incident.recommendedAction.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono mt-2 leading-relaxed">
                      {incident.recommendedAction.rationale}
                    </p>
                  </div>
                </div>

                {/* Quick actions bar */}
                <div className="flex items-center gap-2 border-t border-zinc-800/60 pt-3">
                  <button
                    onClick={() =>
                      onTriageAction(
                        incident.id,
                        incident.recommendedAction.type,
                        `Accepting auto-filter: ${incident.recommendedAction.rationale}`
                      )
                    }
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs py-2 rounded transition cursor-pointer text-center"
                  >
                    Deploy Action
                  </button>
                  <button
                    onClick={() =>
                      onTriageAction(
                        incident.id,
                        "DISMISS",
                        "Moderator dismissed threat alert: Declared safe."
                      )
                    }
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-mono text-xs px-3 py-2 rounded border border-zinc-700 transition cursor-pointer"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 📐 Narrative & Metrics Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Narrative Clusters monitoring */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Active Narrative Clusters
            </h2>
            <button
              onClick={() => onNavigateToView("RADAR")}
              className="text-xs font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
            >
              Radar Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 divide-y divide-zinc-800/80">
            {hotClusters.map((cluster) => (
              <div key={cluster.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-zinc-100 truncate">{cluster.name}</span>
                    <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-1 py-0.2 rounded font-mono font-black shrink-0">
                      +{cluster.growthRate}% GROWTH
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 leading-relaxed">
                    {cluster.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                    <span>{cluster.postCount} Posts</span>
                    <span>{cluster.commentCount} comments analyzed</span>
                    <span className="text-zinc-600">|</span>
                    <span className={`${cluster.sourcesEntropy < 0.2 ? "text-rose-400" : "text-zinc-500"}`}>
                      Sentiment Structure: {cluster.sourcesEntropy < 0.2 ? "Highly Concentrated" : "Organic Discussions"}
                    </span>
                  </div>
                </div>
                <div>
                  <ScoreRing score={cluster.engagementDensity > 10 ? 94 : cluster.engagementDensity > 8 ? 82 : 64} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SVG historical stabilization trend */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-500" />
              Weekly Stabilization Progress
            </h2>
            <button
              onClick={() => onNavigateToView("METRICS")}
              className="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
            >
              Analyze Metrics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono text-xs flex flex-col justify-between h-[230px] transition-all">
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-[10px] text-zinc-500">Blocked incidents over last 7 days</span>
                <p className="text-zinc-300 text-[10.5px] mt-1 font-sans">Trajectory of flagged incidents handled over the current week</p>
              </div>
              
              {/* Telemetry spot value indicator */}
              <div className="text-right shrink-0 bg-zinc-950/60 rounded px-2.5 py-1.5 border border-zinc-850/65 min-w-[130px] min-h-[58px] flex flex-col justify-center">
                {hoveredSaveIndex !== null ? (
                  <>
                    <span className="text-[8px] text-rose-400 font-bold uppercase block tracking-wider animate-pulse">Spot Telemetry</span>
                    <span className="text-sm font-black text-rose-450 block mt-0.5">{savings[hoveredSaveIndex].incidentsBlocked} blocked</span>
                    <span className="text-[9px] text-zinc-400 block mt-0.5 font-sans">{savings[hoveredSaveIndex].date}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[8px] text-zinc-500 uppercase block tracking-wider">Weekly Total</span>
                    <span className="text-sm font-black text-zinc-100 block mt-0.5">
                      {savings.reduce((sum, s) => sum + s.incidentsBlocked, 0)} blocked
                    </span>
                    <span className="text-[9px] text-zinc-400 block mt-0.5 font-sans">Stabilization Active</span>
                  </>
                )}
              </div>
            </div>
            
            {/* SVG Plot */}
            <div className="relative mt-2 h-28 flex items-end">
              <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2={plotWidth} y2="20" className="stroke-zinc-800/40" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2={plotWidth} y2="60" className="stroke-zinc-800/40" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2={plotWidth} y2="100" className="stroke-zinc-800/40" strokeDasharray="3 3" />
                
                {/* Vertical Guideline on Hover */}
                {hoveredSaveIndex !== null && (() => {
                  const x = (hoveredSaveIndex / (savings.length - 1)) * plotWidth;
                  const hoveredPoint = savings[hoveredSaveIndex];
                  const y = plotHeight - (hoveredPoint.incidentsBlocked / maxIncidents) * (plotHeight - 15) - 10;
                  return (
                    <g className="pointer-events-none">
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={plotHeight}
                        className="stroke-rose-500/20"
                        strokeDasharray="2 2"
                        strokeWidth="1.2"
                      />
                      <line
                        x1={0}
                        y1={y}
                        x2={plotWidth}
                        y2={y}
                        className="stroke-rose-500/20"
                        strokeDasharray="2 2"
                        strokeWidth="1.2"
                      />
                      {/* Interactive ring highlight around point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        className="fill-rose-500/10 stroke-rose-400/40 stroke-[0.8] animate-ping"
                      />
                    </g>
                  );
                })()}

                {/* Filled gradient area under line */}
                {savings.length > 1 && (
                  <path
                    d={`M 0,${plotHeight} L ${trendPoints} L ${plotWidth},${plotHeight} Z`}
                    className="fill-rose-500/5"
                  />
                )}
                
                {/* Stroke line */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={trendPoints}
                  className="stroke-rose-500"
                />

                {/* Nodes on points */}
                {savings.map((s, idx) => {
                  const x = (idx / (savings.length - 1)) * plotWidth;
                  const y = plotHeight - (s.incidentsBlocked / maxIncidents) * (plotHeight - 15) - 10;
                  const isHovered = hoveredSaveIndex === idx;
                  return (
                    <g key={idx} className="group/node pointer-events-none">
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? "5" : "3.5"}
                        className={`fill-zinc-950 stroke-rose-500 transition-all ${
                          isHovered ? "stroke-[3px]" : "stroke-2"
                        }`}
                      />
                    </g>
                  );
                })}

                {/* Invisible hover-tracking capture slices */}
                {savings.map((_s, idx) => {
                  const sliceWidth = plotWidth / (savings.length - 1);
                  const xStart = (idx - 0.5) * sliceWidth;
                  const xEnd = (idx + 0.5) * sliceWidth;
                  const left = Math.max(0, xStart);
                  const right = Math.min(plotWidth, xEnd);
                  const w = right - left;

                  return (
                    <rect
                      key={`slice-${idx}`}
                      x={left}
                      y={0}
                      width={w}
                      height={plotHeight}
                      className="fill-transparent cursor-crosshair"
                      onMouseEnter={() => setHoveredSaveIndex(idx)}
                      onMouseLeave={() => setHoveredSaveIndex(null)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Labels under plot */}
            <div className="flex justify-between text-[9px] text-zinc-500 border-t border-zinc-805 pt-2 font-mono">
              {savings.map((s, idx) => (
                <span 
                  key={idx}
                  className={`transition-colors duration-150 ${
                    hoveredSaveIndex === idx ? "text-rose-400 font-bold" : ""
                  }`}
                >
                  {s.date}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
