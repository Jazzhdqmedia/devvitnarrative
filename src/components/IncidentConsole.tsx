/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Incident,
  SubredditPolicy,
  ThreatSeverity,
  IncidentStatus,
  ModerationAction
} from "../types";
import {
  Search,
  Filter,
  ShieldQuestion,
  BookOpen,
  User,
  Activity,
  History,
  AlertTriangle,
  X,
  Lock,
  MessageSquare,
  Clock,
  Eye,
  LifeBuoy
} from "lucide-react";
import { ThreatBadge, StatusBadge, ActionBadge, ScoreRing } from "./Visuals";

interface IncidentConsoleProps {
  incidents: Incident[];
  policies: SubredditPolicy[];
  onApplyAction: (incidentId: string, action: string, reason: string) => void;
}

export const IncidentConsole: React.FC<IncidentConsoleProps> = ({
  incidents,
  policies,
  onApplyAction
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [ruleFilter, setRuleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [triageReason, setTriageReason] = useState("");

  // Re-sync local selection from updated parent list to maintain responsive updates inside the Drawer!
  const currentSelected = selectedIncident 
    ? incidents.find(i => i.id === selectedIncident.id) || selectedIncident 
    : null;

  // Filter operations
  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.threadTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity =
      severityFilter === "ALL" || incident.threatLevel === severityFilter;
      
    const matchesRule =
      ruleFilter === "ALL" || incident.violatesRuleId === ruleFilter;

    const matchesStatus =
      statusFilter === "ALL" || incident.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesRule && matchesStatus;
  });

  const handleActionClick = (actionName: string) => {
    if (!currentSelected) return;
    const actionReason = triageReason.trim() || `Manual deployment of ${actionName} applied by moderator.`;
    onApplyAction(currentSelected.id, actionName, actionReason);
    setTriageReason(""); // Reset text field
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-zinc-805 pb-4">
        <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
          Incident Ledger
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review, analyze, and moderate flagged comments and posts in r/WorldTech.
        </p>
      </div>

      {/* 🧭 Filters Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-lg border border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-mono">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 pl-9 rounded font-mono text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-rose-500/50"
          />
          <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-2.5" />
        </div>

        {/* Filters dropdown split */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          
          {/* Severity selector */}
          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span className="text-zinc-500">Threat:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-rose-505"
            >
              <option value="ALL">All Severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Rule mapping code */}
          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span className="text-zinc-500">Rule violates:</span>
            <select
              value={ruleFilter}
              onChange={(e) => setRuleFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-855 rounded px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-rose-505"
            >
              <option value="ALL">All Rule Violations</option>
              {policies.map(p => (
                <option key={p.id} value={p.id}>Rule {p.ruleNumber}: {p.name.slice(0, 16)}...</option>
              ))}
            </select>
          </div>

          {/* Status mapping */}
          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span className="text-zinc-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 focus:outline-none focus:border-rose-505"
            >
              <option value="ALL">All States</option>
              <option value="PENDING">Pending</option>
              <option value="STABILIZED">Stabilized</option>
              <option value="IGNORED">Ignored</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📊 Console Grid layout split into Ledger Table on left, Detailed Drawer on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main table ledger */}
        <div className="w-full lg:flex-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-zinc-950 text-zinc-500 border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                  <th className="p-4 font-bold">Case ID</th>
                  <th className="p-4 font-bold">Content</th>
                  <th className="p-4 font-bold">Author</th>
                  <th className="p-4 font-bold">Rule Mapped</th>
                  <th className="p-4 font-bold">Brigade Likelihood</th>
                  <th className="p-4 font-bold">Recommendation</th>
                  <th className="p-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500 italic">
                      No incidents matching active query filters in ledger logs.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => {
                    const isSelected = currentSelected?.id === incident.id;
                    const matchedRule = policies.find(p => p.id === incident.violatesRuleId);

                    return (
                      <tr
                        key={incident.id}
                        onClick={() => {
                          setSelectedIncident(incident);
                          setTriageReason(""); // Reset intermediate reason
                        }}
                        className={`hover:bg-zinc-850/40 cursor-pointer transition ${
                          isSelected ? "bg-rose-500/5 hover:bg-rose-500/5 border-l-2 border-rose-500" : ""
                        }`}
                      >
                        {/* CASE_ID */}
                        <td className="p-4 font-bold text-zinc-400 select-none">
                          {incident.id}
                        </td>
                        
                        {/* CONTENT_VECTOR */}
                        <td className="p-4 max-w-sm">
                          <div className="font-semibold text-zinc-200 truncate leading-tight">
                            {incident.threadTitle}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate mt-1 leading-none italic max-w-xs font-sans">
                            &ldquo;{incident.contentSnippet}&rdquo;
                          </div>
                        </td>

                        {/* SOURCE */}
                        <td className="p-4 whitespace-nowrap text-zinc-350">
                          u/{incident.author}
                        </td>

                        {/* RULE_MAP */}
                        <td className="p-4 whitespace-nowrap">
                          {matchedRule ? (
                            <span className="text-zinc-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
                              Rule {matchedRule.ruleNumber} ({Math.floor((incident.ruleMatchConfidence || 0) * 100)}%)
                            </span>
                          ) : (
                            <span className="text-zinc-500 italic">No direct breach</span>
                          )}
                        </td>

                        {/* BRIGADE PROBABILITY */}
                        <td className="p-4 font-bold text-amber-500 whitespace-nowrap">
                          {incident.brigadeProbability}%
                        </td>

                        {/* RECOMMENDED ACTION */}
                        <td className="p-4 whitespace-nowrap">
                          <ActionBadge action={incident.recommendedAction.type} />
                        </td>

                        {/* STATUS */}
                        <td className="p-4 text-center whitespace-nowrap">
                          <StatusBadge status={incident.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RHS sliding detail panel (Drawer) */}
        {currentSelected && (
          <div className="w-full lg:w-[420px] bg-zinc-900 border border-zinc-800 rounded-lg p-5 shrink-0 self-start space-y-5 lg:sticky top-4 max-h-none lg:max-h-[82vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-550 block">Case Record</span>
                <span className="text-sm font-mono font-black text-rose-450 block mt-0.5 uppercase">
                  {currentSelected.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-zinc-500 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Core thread context */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Thread Context URL</span>
              <a
                href={currentSelected.threadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-zinc-200 hover:text-rose-400 hover:underline block leading-relaxed"
              >
                {currentSelected.threadTitle}
              </a>
              <p className="text-[11px] font-sans leading-relaxed text-zinc-400 bg-zinc-950/60 p-3 rounded border border-zinc-850 mt-1 max-h-36 overflow-y-auto">
                &ldquo;{currentSelected.contentSnippet}&rdquo;
              </p>
            </div>

            {/* Threat intelligence overlay */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950/50 rounded border border-zinc-850 font-mono text-[10px]">
              <div className="space-y-1">
                <span className="text-zinc-500 block">Threat Severity</span>
                <ThreatBadge level={currentSelected.threatLevel} />
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 block">Risk Score</span>
                <span className="font-bold text-xs text-rose-500">{currentSelected.riskScore}/100</span>
              </div>
              <div className="space-y-1 border-t border-zinc-850 pt-2">
                <span className="text-zinc-500 block">Brigade Chance</span>
                <span className="font-bold text-amber-500">{currentSelected.brigadeProbability}% Coordinated</span>
              </div>
              <div className="space-y-1 border-t border-zinc-850 pt-2">
                <span className="text-zinc-500 block">User Reputation</span>
                <span className="font-bold text-zinc-400">Score: {currentSelected.userReputationScore || 10}/100</span>
              </div>
            </div>

            {/* Suggested firewall details */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500 uppercase font-black tracking-wider block">Guideline Recommendation</span>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1 rounded text-[9px] font-bold">
                  {Math.floor(currentSelected.recommendedAction.confidence * 100)}% Match
                </span>
              </div>
              <ActionBadge action={currentSelected.recommendedAction.type} />
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-2">
                {currentSelected.recommendedAction.rationale}
              </p>
            </div>

            {/* Audit log trail */}
            {currentSelected.historyLog && currentSelected.historyLog.length > 0 && (
              <div className="space-y-2 border-t border-zinc-850 pt-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                  <History className="w-3.5 h-3.5" /> SECURITY AUDIT LOGS
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto text-[9px] font-mono text-zinc-500">
                  {currentSelected.historyLog.map((log, index) => (
                    <p key={index} className="leading-tight pl-2 border-l border-zinc-800 py-0.5">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive triage actions */}
            {currentSelected.status === IncidentStatus.PENDING ? (
              <div className="space-y-3 border-t border-zinc-800 pt-4">
                <span className="text-[10.5px] font-sans text-zinc-500 block font-semibold">Moderator Action Option</span>
                
                {/* Rationale input field */}
                <textarea
                  placeholder="Triage Decision Rationale (Optional)..."
                  value={triageReason}
                  onChange={(e) => setTriageReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded text-[11px] font-mono text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-rose-500/40"
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleActionClick(currentSelected.recommendedAction.type)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs py-2 rounded transition cursor-pointer text-center"
                  >
                    Deploy Action
                  </button>
                  <button
                    onClick={() => handleActionClick("DISMISS")}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-mono text-xs py-2 rounded border border-zinc-700 transition cursor-pointer text-center"
                  >
                    Dismiss Alert
                  </button>
                </div>
                <button
                  onClick={() => handleActionClick("ESCALATE")}
                  className="w-full bg-zinc-950 hover:bg-rose-950/20 text-rose-500 hover:text-rose-450 border border-rose-950/40 font-mono text-[11px] py-1.5 rounded transition cursor-pointer text-center uppercase"
                >
                  🚀 Escalate to Reddit Admins
                </button>
              </div>
            ) : (
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850/80 text-center font-mono text-xs space-y-1">
                <p className="text-zinc-550 uppercase font-black tracking-wider">Resolved</p>
                <p className="text-zinc-400 font-bold block mt-1">
                  Status: {currentSelected.status}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed font-sans">
                  Firewall measures have successfully stabilized active comment velocities on this thread. Mod team can override rules in settings.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
