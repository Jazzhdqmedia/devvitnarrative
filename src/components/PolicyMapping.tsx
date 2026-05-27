/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SubredditPolicy, DashboardMetrics } from "../types";
import {
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Search,
  Activity,
  AlertCircle
} from "lucide-react";

interface PolicyMappingProps {
  policies: SubredditPolicy[];
  metrics: DashboardMetrics;
}

export const PolicyMapping: React.FC<PolicyMappingProps> = ({ policies, metrics }) => {
  const [selectedPolicy, setSelectedPolicy] = useState<SubredditPolicy | null>(policies[0] || null);

  // Calculate matching counts based on metrics
  const getInfractionCount = (ruleId: string) => {
    const pair = metrics.distributionByRule.find(d => d.ruleId === ruleId);
    return pair ? pair.count : 0;
  };

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="border-b border-zinc-805 pb-4">
        <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
          Subreddit Policy Rules
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review how flagged posts are categorized under each sub-guideline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Policies selector */}
        <div className="col-span-1 lg:col-span-5 bg-zinc-90 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/20 font-mono text-[10px] text-zinc-550 uppercase font-bold">
            Subreddit Guidelines
          </div>
          
          <div className="divide-y divide-zinc-850">
            {policies.map((policy) => {
              const isSelected = selectedPolicy?.id === policy.id;
              const count = getInfractionCount(policy.id);

              return (
                <div
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition select-none ${
                    isSelected ? "bg-rose-500/5 border-l-2 border-rose-500" : "hover:bg-zinc-850/30"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0 font-sans">
                    <span className="font-mono text-[10px] text-zinc-550 block font-bold leading-none">Rule 0{policy.ruleNumber}</span>
                    <span className="font-semibold text-xs text-zinc-205 truncate block mt-1">
                      {policy.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-sans">
                    <div className="text-right font-mono text-[10px]">
                      <span className="text-zinc-500 block">Flags Trailed</span>
                      <span className="text-rose-455 font-bold block mt-0.5">{count} Total</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: policy description & triggers */}
        <div className="col-span-1 lg:col-span-7 space-y-4 font-mono">
          {selectedPolicy ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
              
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-[10px] text-zinc-500 block font-semibold uppercase font-sans">Rule Criteria</span>
                <h2 className="text-sm font-black text-rose-450 block mt-1 uppercase">
                  Rule {selectedPolicy.ruleNumber}: {selectedPolicy.name}
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-1.5 p-4 bg-zinc-950 rounded border border-zinc-850">
                <span className="text-[10px] text-zinc-500 uppercase block font-sans">Official Guideline Text</span>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal">
                  {selectedPolicy.description}
                </p>
              </div>

              {/* Semantic triggers mapped on AI list */}
              <div className="space-y-3">
                <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1 font-semibold font-sans">
                  <Activity className="w-3.5 h-3.5 text-rose-500" /> AI Detection Matchers
                </span>
                
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-1">
                  The moderator panel intercepts text containing structures matching the following concepts:
                </p>

                <div className="space-y-2">
                  {selectedPolicy.narrativeTriggers.map((trigger, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-950/60 rounded border border-zinc-850 text-xs font-semibold text-zinc-300 flex items-center gap-2.5 leading-none pl-4 border-l-2 border-l-rose-500/55"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{trigger}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated policy lock indicator */}
              <div className="bg-[#0f241c]/30 border border-emerald-950/40 p-4 rounded-lg flex items-center gap-3">
                <div className="w-7 h-7 bg-emerald-900/30 rounded border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <div className="leading-tight font-sans">
                  <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Rule Guard Level</span>
                  <span className="text-[11px] text-zinc-400 font-sans mt-1 block">
                    AI models categorize and trace breaches within a standard threshold of <strong className="text-emerald-400">82%+ similarity</strong>.
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-90 w-full p-8 text-center text-zinc-500 font-mono text-xs border border-zinc-800 rounded">
              Select any guideline rules vector on the left to verify triggers.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
