/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CoordinationCluster, ThreatSeverity, CoordinationNode } from "../types";
import {
  Sparkles,
  Link2,
  Users,
  Target,
  Compass,
  AlertTriangle,
  Fingerprint,
  Radio,
  ExternalLink,
  Shield,
  ShieldAlert,
  Zap,
  RotateCcw,
  Lock,
  Unlock,
  Activity,
  Globe,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ThreatBadge } from "./Visuals";

interface CoordinationProps {
  clusters: CoordinationCluster[];
}

export const CoordinationTracker: React.FC<CoordinationProps> = ({ clusters }) => {
  const [selectedCluster, setSelectedCluster] = useState<CoordinationCluster | null>(clusters[0] || null);

  // Interaction States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  // Custom Drag position offsets
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, { x: number; y: number }>>({});
  
  // High-Tech isolation features
  const [toggledBlocks, setToggledBlocks] = useState<Record<string, boolean>>({});
  const [isTraceRoute, setIsTraceRoute] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset interactive states when shifting clusters
  useEffect(() => {
    setSelectedNodeId(null);
    setHoveredNodeId(null);
    setDraggedNodeId(null);
    setNodeOffsets({});
    setIsTraceRoute(false);
    // Retain toggledBlocks so state persists logically during user session
  }, [selectedCluster?.id]);

  // SVG network dimensions
  const width = 450;
  const height = 240;

  // Un-offset positions of nodes configured in circular constellation array
  const getBaseNodePosition = (nodeId: string, idx: number, totalCount: number) => {
    if (idx === 0) return { x: width / 2, y: height / 2 }; // Core threat node at exact center
    
    // Distribute remaining elements uniformly around core
    const angle = (idx / (totalCount - 1)) * Math.PI * 2;
    const radius = 78 + (idx % 2) * 16;
    
    return {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius
    };
  };

  // Dynamically resolve final node positions incorporating live dragging offsets
  const getNodePosition = (nodeId: string, idx: number, totalCount: number) => {
    const base = getBaseNodePosition(nodeId, idx, totalCount);
    const offset = nodeOffsets[nodeId] || { x: 0, y: 0 };
    return {
      x: base.x + offset.x,
      y: base.y + offset.y
    };
  };

  // Graph Helpers/Computed Metrics
  const activeNodeId = draggedNodeId || hoveredNodeId || selectedNodeId;

  const isNodeConnected = (nodeId: string) => {
    if (!activeNodeId) return true;
    if (activeNodeId === nodeId) return true;
    return selectedCluster?.links.some(
      (l) => (l.source === activeNodeId && l.target === nodeId) || (l.source === nodeId && l.target === activeNodeId)
    ) ?? false;
  };

  const isLinkConnected = (source: string, target: string) => {
    if (!activeNodeId) return true;
    return source === activeNodeId || target === activeNodeId;
  };

  const getNodeDegree = (nodeId: string) => {
    return selectedCluster?.links.filter((l) => l.source === nodeId || l.target === nodeId).length || 0;
  };

  const getNodeImpactScore = (node: CoordinationNode) => {
    const degree = getNodeDegree(node.id);
    return Math.min(100, node.weight * 5 + degree * 8);
  };

  // Helper resolving active entity details
  const activeNode = selectedCluster?.nodes.find((n) => n.id === activeNodeId);

  // SVG Drag & Snap Handlers
  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId || !selectedCluster) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Boundaries protection inside visual workspace limits
    const padding = 18;
    const svgX = Math.max(padding, Math.min(width - padding, ((e.clientX - rect.left) / rect.width) * width));
    const svgY = Math.max(padding, Math.min(height - padding, ((e.clientY - rect.top) / rect.height) * height));
    
    const idx = selectedCluster.nodes.findIndex((n) => n.id === draggedNodeId);
    if (idx === -1) return;
    
    const base = getBaseNodePosition(draggedNodeId, idx, selectedCluster.nodes.length);
    
    setNodeOffsets((prev) => ({
      ...prev,
      [draggedNodeId]: {
        x: svgX - base.x,
        y: svgY - base.y,
      },
    }));
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const handleSVGMouseUpOrLeave = () => {
    setDraggedNodeId(null);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const toggleIsolateNode = (nodeId: string, label: string) => {
    const wasIsolated = !!toggledBlocks[nodeId];
    setToggledBlocks((prev) => ({
      ...prev,
      [nodeId]: !wasIsolated,
    }));
    triggerToast(
      wasIsolated
        ? `RESTORED_NODE: Re-connected inbound traffic flow from [${label}]`
        : `ISOLATED_NODE: Diverted & blocked synchronized telemetry for [${label}]`
    );
  };

  // Custom visual icon provider
  const getEntityIcon = (type: string, className = "w-4 h-4") => {
    switch (type) {
      case "THREAD":
        return <Activity className={`${className} text-rose-500`} />;
      case "DISCORD_SERVER":
        return <Radio className={`${className} text-blue-500`} />;
      case "EXTERNAL_LINK":
        return <ExternalLink className={`${className} text-amber-500`} />;
      case "SUBREDDIT":
        return <Globe className={`${className} text-purple-500`} />;
      case "USER":
      default:
        return <Users className={`${className} text-zinc-400`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Action Notification Toast inside the Tracking workspace */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-950 border-2 border-rose-500/80 rounded p-4 font-mono text-[11px] shadow-2xl max-w-sm animate-bounce text-zinc-100 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[10px] text-zinc-500 uppercase tracking-widest mb-1">TACTICAL_DEFENSE_REPORT</div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> COORDINATION_TRACKER
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Detecting coordinated inauthentic behavior, synchronized account deployment, cross-platform link referrals, and subreddit brigading. Drag elements directly to audit structural linkages.
          </p>
        </div>
        <div className="bg-zinc-950 px-2.5 py-1 rounded border border-zinc-850 font-mono text-[9.5px] text-zinc-550 flex items-center gap-1.5 shrink-0">
          <Activity className="w-3.5 h-3.5 text-rose-500 animate-[pulse_1s_infinite]" />
          <span>CYBER_DEFENSE_LATTICE_MONITOR</span>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coordination clusters selector (Left column - 4 cols) */}
        <div className="col-span-1 lg:col-span-4 space-y-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">
            DETECTED_SWARM_CLUMPS ({clusters.length})
          </span>
          
          <div className="grid grid-cols-1 gap-3">
            {clusters.map((cluster) => {
              const isSelected = selectedCluster?.id === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 w-full bg-zinc-900 border rounded-lg text-left cursor-pointer transition-all duration-350 select-none flex flex-col justify-between space-y-3 ${
                    isSelected 
                      ? "border-rose-500 shadow-lg shadow-rose-500/[0.04] bg-gradient-to-br from-rose-500/[0.04] to-zinc-900" 
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-90/40"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-mono text-xs font-black text-zinc-200 truncate block">
                      {cluster.name}
                    </span>
                    <ThreatBadge level={cluster.threatLevel} />
                  </div>
                  <p className="text-[10.5px] font-mono text-zinc-400 leading-normal line-clamp-2">
                    {cluster.detectionReason}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-t border-zinc-800/40 pt-2 shrink-0">
                    <span className="font-bold">{cluster.nodesCount} ENTITY NODES</span>
                    <span>ID: {cluster.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Constellation SVG details (Right column - 8 cols) */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          {selectedCluster ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
              
              {/* Constellation Workspace Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="font-mono font-bold text-xs text-zinc-350">
                    AFFILIATION_MAP_DAEMON: {selectedCluster.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-zinc-950 font-semibold text-rose-500/90 px-1.5 py-0.5 rounded border border-zinc-850 tracking-widest block uppercase animate-pulse">
                    COORDINATION_SWARM
                  </span>
                  <span className="text-[10px] font-mono text-zinc-550 uppercase font-semibold">
                    {selectedCluster.nodesCount} elements
                  </span>
                </div>
              </div>

              {/* Explaining rationale */}
              <div className="p-3.5 bg-zinc-950 rounded border border-zinc-850 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 font-bold">
                  <Fingerprint className="w-3.5 h-3.5 text-zinc-500" /> DETECTOR_LOG_BRIEF:
                </span>
                <p className="text-[11px] font-mono text-zinc-300 leading-relaxed font-sans">
                  {selectedCluster.detectionReason}
                </p>
              </div>

              {/* Interactive SVG Network Constellation container */}
              <div className="relative w-full aspect-[450/240] bg-[#070708] border border-zinc-850/80 rounded-lg overflow-hidden flex flex-col items-center justify-center p-3 select-none">
                
                {/* SVG Style injections (Flow lines) */}
                <style>{`
                  @keyframes linkFlow {
                    to {
                      stroke-dashoffset: -16;
                    }
                  }
                  .animate-link-flow {
                    stroke-dasharray: 6 4;
                    animation: linkFlow 1s linear infinite;
                  }
                  .node-pulse-circle {
                    animation: nodeHoloPulse 2s infinite ease-in-out;
                  }
                  @keyframes nodeHoloPulse {
                    0%, 100% {
                      r: 9px;
                      opacity: 0.15;
                    }
                    50% {
                      r: 15px;
                      opacity: 0.45;
                    }
                  }
                `}</style>

                {/* Cyber Matrix Coordinate grid backdrop */}
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                  backgroundImage: `linear-gradient(to right, #1d1d20 1px, transparent 1px), linear-gradient(to bottom, #1d1d20 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }} />

                {/* SVG Canvas drawing */}
                <svg 
                  viewBox={`0 0 ${width} ${height}`} 
                  className="w-full h-full overflow-visible z-10 cursor-crosshair"
                  onMouseMove={handleSVGMouseMove}
                  onMouseUp={handleSVGMouseUpOrLeave}
                  onMouseLeave={handleSVGMouseUpOrLeave}
                >
                  {/* Outer Orbit Guideline Rings */}
                  <circle cx={width/2} cy={height/2} r="80" className="stroke-zinc-850/40 fill-transparent pointer-events-none" strokeWidth="0.8" strokeDasharray="3 4" />
                  <circle cx={width/2} cy={height/2} r="96" className="stroke-zinc-850/20 fill-transparent pointer-events-none" strokeWidth="0.6" />

                  {/* Draw link lines first */}
                  {selectedCluster.links.map((link, idx) => {
                    const sourceIdx = selectedCluster.nodes.findIndex((n) => n.id === link.source);
                    const targetIdx = selectedCluster.nodes.findIndex((n) => n.id === link.target);
                    if (sourceIdx === -1 || targetIdx === -1) return null;

                    const sourcePos = getNodePosition(link.source, sourceIdx, selectedCluster.nodes.length);
                    const targetPos = getNodePosition(link.target, targetIdx, selectedCluster.nodes.length);

                    const isHighlight = isLinkConnected(link.source, link.target);
                    const linkFlowActivated = (activeNodeId === link.source || activeNodeId === link.target) || isTraceRoute;
                    
                    // Dim non-connected links
                    const linkOpacity = activeNodeId 
                      ? (isHighlight ? 0.8 : 0.05)
                      : (0.15 + (link.weight / 15) * 0.2);

                    const strokeColor = linkFlowActivated 
                      ? (toggledBlocks[link.source] || toggledBlocks[link.target] ? "#64748b" : "#f43f5e")
                      : (idx % 2 === 0 ? "#ff4444" : "#ec4899");

                    return (
                      <g key={`l-${idx}`} className="transition-opacity duration-300">
                        {/* Core static line segment */}
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          stroke={strokeColor}
                          strokeOpacity={linkOpacity}
                          strokeWidth={isHighlight ? 1.6 + link.weight * 0.12 : 1 + link.weight * 0.08}
                          strokeDasharray={(!linkFlowActivated && link.weight <= 8) ? "3 3" : undefined}
                          className="transition-opacity duration-300"
                        />
                        {/* Scrolling energy flow particles overlay */}
                        {linkFlowActivated && (
                          <line
                            x1={sourcePos.x}
                            y1={sourcePos.y}
                            x2={targetPos.x}
                            y2={targetPos.y}
                            stroke={strokeColor}
                            strokeOpacity={linkOpacity * 1.5}
                            strokeWidth={2 + link.weight * 0.15}
                            className="animate-link-flow pointer-events-none"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes drawing */}
                  {selectedCluster.nodes.map((node, idx) => {
                    const pos = getNodePosition(node.id, idx, selectedCluster.nodes.length);
                    const isNodeActive = activeNodeId === node.id;
                    const isNodeVisible = isNodeConnected(node.id);
                    const isIsolated = toggledBlocks[node.id];

                    // Style setup
                    let markerColor = "fill-zinc-800 stroke-zinc-600";
                    let glowColor = "#ffffff";
                    
                    if (node.type === "THREAD") {
                      markerColor = isIsolated ? "fill-zinc-800 stroke-zinc-500" : "fill-rose-950 stroke-rose-500";
                      glowColor = "#ef4444";
                    } else if (node.type === "DISCORD_SERVER") {
                      markerColor = isIsolated ? "fill-zinc-800 stroke-zinc-500" : "fill-blue-950 stroke-blue-400";
                      glowColor = "#3b82f6";
                    } else if (node.type === "EXTERNAL_LINK") {
                      markerColor = isIsolated ? "fill-zinc-800 stroke-zinc-500" : "fill-amber-950 stroke-amber-500";
                      glowColor = "#f59e0b";
                    } else if (node.type === "USER") {
                      markerColor = isIsolated ? "fill-zinc-800 stroke-zinc-500" : "fill-zinc-950 stroke-rose-450";
                      glowColor = "#dc2626";
                    } else if (node.type === "SUBREDDIT") {
                      markerColor = isIsolated ? "fill-zinc-800 stroke-zinc-500" : "fill-purple-950 stroke-purple-500";
                      glowColor = "#a855f7";
                    }

                    const opacity = isNodeVisible ? 1 : 0.22;
                    const isCenterNode = idx === 0;

                    return (
                      <g 
                        key={node.id} 
                        className="transition-opacity duration-300 select-none cursor-grab active:cursor-grabbing"
                        style={{ opacity }}
                        onMouseEnter={() => !draggedNodeId && setHoveredNodeId(node.id)}
                        onMouseLeave={() => !draggedNodeId && setHoveredNodeId(null)}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                      >
                        {/* Node Halo Wave Back-glow on highlight */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isNodeActive ? 14 : 9}
                          fill="transparent"
                          stroke={glowColor}
                          strokeOpacity={isNodeActive ? 0.35 : 0.0}
                          className={isNodeActive ? "node-pulse-circle pointer-events-none" : "pointer-events-none"}
                        />

                        {/* Node tactical bracket target boundaries */}
                        {isNodeActive && (
                          <g className="pointer-events-none opacity-90">
                            {/* Four cyber corner markers */}
                            <path d={`M ${pos.x - 12} ${pos.y - 7} L ${pos.x - 12} ${pos.y - 12} L ${pos.x - 7} ${pos.y - 12}`} fill="none" stroke={glowColor} strokeWidth="1" />
                            <path d={`M ${pos.x + 12} ${pos.y - 7} L ${pos.x + 12} ${pos.y - 12} L ${pos.x + 7} ${pos.y - 12}`} fill="none" stroke={glowColor} strokeWidth="1" />
                            <path d={`M ${pos.x - 12} ${pos.y + 7} L ${pos.x - 12} ${pos.y + 12} L ${pos.x - 7} ${pos.y + 12}`} fill="none" stroke={glowColor} strokeWidth="1" />
                            <path d={`M ${pos.x + 12} ${pos.y + 7} L ${pos.x + 12} ${pos.y + 12} L ${pos.x + 7} ${pos.y + 12}`} fill="none" stroke={glowColor} strokeWidth="1" />
                          </g>
                        )}

                        {/* Base Core Node */}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isCenterNode ? (isNodeActive ? 10.5 : 8.5) : (isNodeActive ? 8 : 6)}
                          className={`${markerColor} transition-colors duration-200 stroke-[1.5] shadow-lg`}
                          style={{
                            filter: isNodeActive ? `drop-shadow(0 0 5px ${glowColor}c0)` : "none",
                          }}
                        />

                        {/* Isolate/Shield indicator flag inside isolated nodes */}
                        {isIsolated && (
                          <path
                            d={`M ${pos.x - 3} ${pos.y - 3} L ${pos.x + 3} ${pos.y + 3} M ${pos.x + 3} ${pos.y - 3} L ${pos.x - 3} ${pos.y + 3}`}
                            stroke="#fff"
                            strokeWidth="1.2"
                            className="pointer-events-none"
                          />
                        )}

                        {/* Label name tags */}
                        <text
                          x={pos.x}
                          y={pos.y - (isNodeActive ? 14 : 10)}
                          className={`font-mono text-[8px] ${
                            isNodeActive ? "fill-white font-extrabold tracking-wide" : "fill-zinc-400 font-semibold"
                          } select-none pointer-events-none text-center`}
                          textAnchor="middle"
                        >
                          {node.label.length > 20 ? node.label.slice(0, 16) + "..." : node.label}
                          {isIsolated && " [BLOCKED]"}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Micro instructions overlay inside the SVG canvas */}
                <div className="absolute bottom-2 left-3 font-mono text-[8px] text-zinc-650 flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-zinc-550 animate-ping" />
                  <span>INTERACTIVE: Drag elements. Hover for spot telemetry. Click-to-Select.</span>
                </div>
                
                {/* Reset system alignment anchor */}
                {Object.keys(nodeOffsets).length > 0 && (
                  <button
                    onClick={() => {
                      setNodeOffsets({});
                      triggerToast("CONSTELLATION_RESET: Re-aligned all nodes to circular grid coordinate anchors.");
                    }}
                    className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded font-mono text-[8.5px] hover:bg-zinc-900 transition hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5 text-rose-500" />
                    <span>RESET LAYOUT</span>
                  </button>
                )}
              </div>

              {/* IMMERSIVE TELEMETRY INSPECTION HUD: Triggers when activeNode exists */}
              <div className="border border-zinc-800 bg-[#0a0a0b]/90 rounded p-4 font-mono space-y-3 transition-all duration-300">
                {activeNode ? (
                  <div className="space-y-3">
                    {/* HUD Header */}
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-rose-500" />
                        <span className="font-bold text-[10.5px] text-zinc-350">
                          CYBER_INTELLIGENCE_HUD // {activeNode.id}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        toggledBlocks[activeNode.id] 
                          ? "bg-zinc-800 text-zinc-400 border-zinc-700" 
                          : "bg-rose-950/40 text-rose-450 border-rose-900/60"
                      }`}>
                        {toggledBlocks[activeNode.id] ? "TELEMETRY_ISOLATED" : "FLOW_ACTIVE"}
                      </span>
                    </div>

                    {/* HUD Grid breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Grid Stats Block (7 cols) */}
                      <div className="col-span-1 md:col-span-7 grid grid-cols-2 gap-3 text-[10.5px]">
                        <div className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850/60 space-y-0.5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-bold">Entity Type</span>
                          <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                            {getEntityIcon(activeNode.type, "w-3.5 h-3.5")} {activeNode.type}
                          </span>
                        </div>
                        <div className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850/60 space-y-0.5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-bold">Clump Label</span>
                          <span className="text-zinc-200 font-bold truncate block">{activeNode.label}</span>
                        </div>
                        <div className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850/60 space-y-0.5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-bold">Swarm Connections</span>
                          <span className="text-zinc-200 font-medium font-mono">
                            <span className="text-zinc-100 font-black">{getNodeDegree(activeNode.id)}</span> connected pathways
                          </span>
                        </div>
                        <div className="bg-zinc-950/80 p-2.5 rounded border border-zinc-850/60 space-y-0.5">
                          <span className="text-zinc-550 block text-[9px] uppercase font-bold">Brigade Centrality</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-rose-450 font-black">{getNodeImpactScore(activeNode)}%</span>
                            <div className="w-12 bg-zinc-800 h-1 rounded overflow-hidden">
                              <div className="bg-rose-500 h-full rounded" style={{ width: `${getNodeImpactScore(activeNode)}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Mitigation Sandbox widgets (5 cols) */}
                      <div className="col-span-1 md:col-span-5 flex flex-col gap-2">
                        {/* Button 1: Isolate / Restore Toggle */}
                        <button
                          onClick={() => toggleIsolateNode(activeNode.id, activeNode.label)}
                          className={`w-full py-2 px-3 rounded text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer text-center select-none ${
                            toggledBlocks[activeNode.id]
                              ? "bg-emerald-850 hover:bg-emerald-800 border border-emerald-700 text-emerald-300"
                              : "bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300"
                          }`}
                        >
                          {toggledBlocks[activeNode.id] ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" /> RE-ENABLE TELEMETRY
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 animate-pulse" /> DEPLOY ISOLATION SHIELD
                            </>
                          )}
                        </button>

                        {/* Button 2: Path Trace toggle */}
                        <button
                          onClick={() => {
                            setIsTraceRoute(!isTraceRoute);
                            triggerToast(
                              isTraceRoute
                                ? "PATH_TRACE: Disabled persistent high-frequency carrier wave tracking inside vector lattice."
                                : "PATH_TRACE: Persistent carrier wave active. Tracking real-time packet transmissions."
                            );
                          }}
                          className={`w-full py-2 px-3 rounded border text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center select-none ${
                            isTraceRoute 
                              ? "bg-rose-500/10 border-rose-500 text-rose-300 hover:bg-rose-500/20" 
                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                          }`}
                        >
                          <Zap className={`w-3.5 h-3.5 ${isTraceRoute ? "text-rose-450 animate-[spin_3s_linear_infinite]" : "text-zinc-500"}`} />
                          <span>PERSIST PATH TRACE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 text-center text-[11px] text-zinc-500 uppercase font-black tracking-wider flex items-center justify-center gap-2 select-none h-[64px]">
                    <Shield className="w-4 h-4 text-zinc-650 animate-pulse" />
                    <span>HOVER OR CLICK ON ANY VECTOR NODE FOR TARGETED SHIELD MITIGATIONS AND RELATION INSPECTION</span>
                  </div>
                )}
              </div>

              {/* Node metadata ledger mapping (Full Intercept Directory) */}
              <div className="space-y-3.5 border-t border-zinc-800 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase block font-bold tracking-wider">
                    INTERCEPTED ENTITY KEY DIRECTORY ({selectedCluster.nodes.length})
                  </span>
                  <span className="text-[9px] text-zinc-500 italic">
                    Coordinates update dynamically with manual user dragging
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono select-none">
                  {selectedCluster.nodes.map((n, idx) => {
                    const isNodeActive = activeNodeId === n.id;
                    const isIsolated = toggledBlocks[n.id];
                    const pos = getNodePosition(n.id, idx, selectedCluster.nodes.length);
                    const isCenterNode = idx === 0;

                    return (
                      <div
                        key={n.id}
                        onMouseEnter={() => setHoveredNodeId(n.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className={`p-3 bg-zinc-950/70 rounded border leading-none transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                          isNodeActive
                            ? "bg-zinc-850 border-zinc-700 shadow-sm scale-[1.01]"
                            : "border-zinc-900/80 hover:bg-zinc-950 hover:border-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {isIsolated ? (
                            <Lock className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
                          ) : (
                            getEntityIcon(n.type, "w-3.5 h-3.5 shrink-0")
                          )}
                          <div className="truncate">
                            <span className="font-bold text-zinc-200">{n.label}</span>
                            <span className="text-[8.5px] text-zinc-500 block mt-1 font-mono">
                              VECTOR_COORD: {pos.x.toFixed(0)}, {pos.y.toFixed(0)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Tactical Actions inside the row */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isIsolated ? (
                            <span className="text-[8px] px-1 bg-zinc-800 text-zinc-500 font-bold border border-zinc-700 rounded leading-none">
                              BLOCKED
                            </span>
                          ) : (
                            isCenterNode && (
                              <span className="text-[8px] px-1 bg-rose-500/10 text-rose-500 font-bold border border-rose-500/30 rounded leading-none">
                                CORE
                              </span>
                            )
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleIsolateNode(n.id, n.label);
                            }}
                            className={`p-1.5 rounded transition cursor-pointer text-center select-none bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 ${
                              isIsolated ? "text-emerald-400" : "text-zinc-400 hover:text-white"
                            }`}
                            title={isIsolated ? "Restore node" : "Isolate node"}
                          >
                            {isIsolated ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-900 w-full p-8 text-center text-zinc-500 font-mono text-xs border border-zinc-800 rounded">
              Select any threat cluster network card on the left to resolve nodes.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
