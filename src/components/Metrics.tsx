/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DashboardMetrics, SubredditPolicy } from "../types";
import { PolicyPieChart } from "./PolicyPieChart";
import {
  BarChart3,
  Scale,
  Calendar,
  Layers,
  HelpCircle,
  Timer,
  ChevronRight,
  ShieldCheck,
  Award
} from "lucide-react";

interface MetricsProps {
  metrics: DashboardMetrics;
  policies: SubredditPolicy[];
}

export const Metrics: React.FC<MetricsProps> = ({ metrics, policies }) => {
  // Calculate total infractions for percentage distribution
  const totalInfractions = metrics.distributionByRule.reduce((acc, pair) => acc + pair.count, 0);

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="border-b border-zinc-805 pb-4">
        <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
          Performance & Impact
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review metrics reflecting estimated moderator hours saved, threads stabilized, and overall rule violation spread.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Savings */}
        <div className="bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono flex items-center gap-4 relative overflow-hidden">
          <div className="flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 w-11 h-11 rounded shrink-0">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="leading-tight flex-1">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Labor Saved</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {metrics.estimatedHoursSaved.toFixed(1)} hours
            </p>
            <span className="text-[9.5px] text-zinc-500 mt-1 block font-medium">Pre-emptive AI de-escalation saves review loops</span>
          </div>
        </div>

        {/* Stable rate */}
        <div className="bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono flex items-center gap-4 relative overflow-hidden">
          <div className="flex items-center justify-center bg-blue-500/10 border border-blue-500/20 w-11 h-11 rounded shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="leading-tight flex-1">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Threads Stabilized</span>
            <p className="text-2xl font-black text-blue-400 mt-1">
              {metrics.threadsStabilized} threads
            </p>
            <span className="text-[9.5px] text-zinc-500 mt-1 block">Suppressed discussion velocity spikes</span>
          </div>
        </div>

        {/* Firewalls deployed */}
        <div className="bg-zinc-90 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono flex items-center gap-4 relative overflow-hidden">
          <div className="flex items-center justify-center bg-rose-500/10 border border-rose-500/20 w-11 h-11 rounded shrink-0">
            <Calendar className="w-5 h-5 text-rose-400" />
          </div>
          <div className="leading-tight flex-1">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Resolutions Enforced</span>
            <p className="text-2xl font-black text-rose-500 mt-1">
              {metrics.firewallDeploymentCount} deployments
            </p>
            <span className="text-[9.5px] text-zinc-500 mt-1 block">Lock, rate limits, and sticky triggers</span>
          </div>
        </div>

      </div>

      {/* Interactive Distribution grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono">
        
        {/* Incidents by violating policy criteria (Left side) */}
        <div className="col-span-1 lg:col-span-7">
          <PolicyPieChart metrics={metrics} policies={policies} />
        </div>

        {/* Saved labor methodology (Right side) */}
        <div className="col-span-1 lg:col-span-5 space-y-4">
          
          {/* Timeline ledger of daily stats */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
            <span className="text-[10px] text-zinc-400 uppercase block flex items-center gap-1.5 font-bold">
              <Timer className="w-4 h-4 text-emerald-400" /> Daily Savings Audit
            </span>

            <div className="space-y-2 overflow-y-auto max-h-[160px] text-[10.5px]">
              {metrics.historicalSavings.slice().reverse().map((day, idx) => (
                <div key={idx} className="flex justify-between border-b border-zinc-850 py-2.5 last:border-0">
                  <span className="text-zinc-400 font-bold">{day.date}</span>
                  <div className="flex gap-4">
                    <span className="text-rose-400">🚨 {day.incidentsBlocked} Flags</span>
                    <span className="text-emerald-400 font-bold">⏱️ +{day.hoursSaved.toFixed(1)} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rationale methodology block */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3 font-sans text-xs">
            <span className="text-[10px] text-zinc-500 uppercase block font-mono font-bold">
              Savings Calculation Model
            </span>
            <p className="text-zinc-400 leading-relaxed font-normal">
              Estimated hours saved are derived using standard mod task-duration rates observed across large subreddits:
            </p>
            <div className="space-y-2 font-mono text-[10px] bg-zinc-950 p-2.5 rounded border border-zinc-900 leading-tight">
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Critical Threat Triage</span>
                <span className="text-rose-400 font-bold">+90 mins / thread</span>
              </div>
              <div className="flex justify-between py-1 border-t border-zinc-900">
                <span className="text-zinc-500">Conspiracy/Spam Mitigation</span>
                <span className="text-orange-400 font-bold">+45 mins / thread</span>
              </div>
              <div className="flex justify-between py-1 border-t border-zinc-900">
                <span className="text-zinc-500">General Mod Triage Review</span>
                <span className="text-zinc-400 font-bold">+10 mins / incident</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 italic mt-2 font-mono leading-tight">
              Pre-emptively applying crowd-filters, pinned informative contexts or comment limitations restricts brigades instantly, stopping reports escalation loops.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
