/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ThreatSeverity,
  IncidentStatus,
  ModerationAction
} from "../types";
import {
  AlertTriangle,
  Flame,
  Shield,
  LifeBuoy,
  Lock,
  Clock,
  MessageSquare,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Compass
} from "lucide-react";

interface ThreatBadgeProps {
  level: ThreatSeverity;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level }) => {
  switch (level) {
    case ThreatSeverity.LOW:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
          <Shield className="w-3.5 h-3.5" /> SECURE
        </span>
      );
    case ThreatSeverity.MEDIUM:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-950/40 text-blue-400 border border-blue-800/50">
          <Compass className="w-3.5 h-3.5" /> MEDIUM
        </span>
      );
    case ThreatSeverity.HIGH:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-950/40 text-amber-400 border border-amber-800/50">
          <AlertTriangle className="w-3.5 h-3.5" /> HIGH THREAT
        </span>
      );
    case ThreatSeverity.CRITICAL:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold animate-pulse bg-rose-950/40 text-rose-400 border border-rose-800/50">
          <Flame className="w-3.5 h-3.5" /> CRITICAL
        </span>
      );
    default:
      return null;
  }
};

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case IncidentStatus.PENDING:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" /> REVIEW PENDING
        </span>
      );
    case IncidentStatus.STABILIZED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-3 h-3" /> STABILIZED
        </span>
      );
    case IncidentStatus.IGNORED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
          <Eye className="w-3 h-3" /> IGNORED
        </span>
      );
    case IncidentStatus.ESCALATED:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="w-3 h-3" /> ADMIN ESCALATED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400">
          <HelpCircle className="w-3 h-3" /> UNDETECTED
        </span>
      );
  }
};

interface ActionBadgeProps {
  action: ModerationAction;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  switch (action) {
    case ModerationAction.NONE:
      return (
        <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
          <Eye className="w-3.5 h-3.5 text-zinc-500" /> Monitor Only
        </span>
      );
    case ModerationAction.AUTO_STICKY:
      return (
        <span className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-mono">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Deploy Sticky Fact-check
        </span>
      );
    case ModerationAction.SLOW_MODE:
      return (
        <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-500" /> Comment Slow-Mode (15s)
        </span>
      );
    case ModerationAction.LOCK_THREAD:
      return (
        <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-red-500" /> Temporary Comment Lock
        </span>
      );
    case ModerationAction.CROWD_CONTROL:
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-emerald-500" /> Activate Crowd Filter
        </span>
      );
    case ModerationAction.MOD_ALERT:
      return (
        <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Escalated alert to queue
        </span>
      );
    case ModerationAction.CONTENT_FILTER:
      return (
        <span className="inline-flex items-center gap-1.5 text-purple-400 text-xs font-mono">
          <LifeBuoy className="w-3.5 h-3.5 text-purple-500" /> Apply Semantic Rule Filters
        </span>
      );
  }
};

interface MiniSparklineProps {
  data: { toxicity_level: number }[];
  color?: string;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, color = "#ff4444" }) => {
  if (data.length === 0) return null;
  const max = 100;
  const width = 80;
  const height = 24;
  const points = data
    .map((d, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (d.toxicity_level / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        className="opacity-75"
      />
      {/* Dynamic pulse node on the last index point */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - (data[data.length - 1].toxicity_level / max) * height}
          r="2.5"
          fill={color}
          className="animate-ping"
        />
      )}
    </svg>
  );
};

export const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const getGlowColor = (s: number) => {
    if (s < 40) return ["text-emerald-500/20", "stroke-emerald-500", "text-emerald-400"];
    if (s < 75) return ["text-amber-500/20", "stroke-amber-500", "text-amber-400"];
    return ["text-red-500/25", "stroke-red-500", "text-red-400"];
  };

  const [bgClass, strokeClass, textClass] = getGlowColor(score);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          className="stroke-zinc-800 fill-transparent"
          strokeWidth="3"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          className={`${strokeClass} fill-transparent transition-all duration-300`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute text-xs font-mono font-bold ${textClass}`}>
        {score}
      </div>
    </div>
  );
};
