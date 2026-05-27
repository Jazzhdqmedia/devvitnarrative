/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SubredditPolicy, ThreatSeverity, Incident } from "../types";
import {
  Terminal,
  Play,
  Activity,
  Award,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Compass,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { ThreatBadge, ActionBadge, ScoreRing } from "./Visuals";

interface SandboxProps {
  policies: SubredditPolicy[];
  onAddIncidentState: (incident: Incident) => void;
}

export const Sandbox: React.FC<SandboxProps> = ({ policies, onAddIncidentState }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Result parameters
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Quick preset loader list
  const presets = [
    {
      label: "1. Hardware Shortage Hoax",
      title: "Silicon Cartels: Why the microchip shortage is a 100% artificial scam",
      text: "Wafer dry up is engineered maliciously. My founder contact at a foundry confirmed they have warehouses full of stockpiled silicons, purposely leaking 'shipment lag' reviews to dry up the markets and inflate margins to 400%!",
      ruleId: "rule-4"
    },
    {
      label: "2. Staff Harassment Raid",
      title: "AI NLP director Charles has locked their Twitter. They deleted the sentience chats!",
      text: "THE CENSORSHIP IS REAL. They are deleting the conversation histories and have put the lead whistleblowing developers on 'relocation sabbatical'. Inundate their support emails, call their office numbers listed on Pastebin, and do not let moderation delete this thread!",
      ruleId: "rule-1"
    },
    {
      label: "3. European Election Deepfake",
      title: "How to run the untraceable political deepfake generator tool leaking on GitHub",
      text: "This generator generates high-fidelity deepfake vocal loops and 4K synthesized clips targeting election processes. Here is the zip file link, replicate it on all nodes before they blacklist it!",
      ruleId: "rule-3"
    },
    {
      label: "4. Token Insolvency Contagion",
      title: "CryptoNexus Exchange is bankruptcy-pending. FTX Part 2 is structural.",
      text: "My transaction withdraw block is frozen for hours. Support is non-responsive. Inside source says the CFO locked up treasury reserves and ledger books are values-short. Cash out staking balances now!",
      ruleId: "rule-2"
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setTitle(preset.title);
    setText(preset.text);
    setSelectedRuleId(preset.ruleId);
    setAnalysisResult(null);
    setErrorMsg("");
  };

  const handleRunAudit = async () => {
    if (!title.trim() || !text.trim()) {
      setErrorMsg("Please provide both a Post/Thread Title and Text Content to analyze.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setErrorMsg("");
    setLoadingStep(1);

    // Simulate cyber-triage indicators to visual polish
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= 4) {
        clearInterval(interval);
      }
    }, 700);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          selectedRuleId: selectedRuleId || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Ensure server is active and configuration is completed.");
      }

      const resData = await response.json();
      clearInterval(interval); // clear if finished early
      setAnalysisResult(resData.aiAnalysis);

      // Inject back to global mutable lists on overview and console
      if (resData.createdIncident) {
        onAddIncidentState(resData.createdIncident);
      }
    } catch (e: any) {
      clearInterval(interval);
      setErrorMsg(e.message || "Something went wrong during narrative interception loops.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-zinc-805 pb-4">
        <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
          AI Rule Sandbox
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Perform real-time policy analyses using Gemini AI. Verify rumors, check triggers, and view automated recommendations.
        </p>
      </div>

      {/* Preset pickers bar */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2 font-mono text-xs">
        <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-wider flex items-center gap-1.5 leading-none font-sans">
          <Lightbulb className="w-3.5 h-3.5 text-rose-500" /> Presets (for evaluation/testing)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          {presets.map((preset, idx) => {
            const isPresetActive = title === preset.title && text === preset.text && selectedRuleId === preset.ruleId;
            return (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`py-2 px-3 border rounded text-[10.5px] font-semibold text-left select-none transition cursor-pointer leading-tight truncate block ${
                  isPresetActive
                    ? "bg-rose-950/40 text-rose-400 border-rose-500/60 shadow-md shadow-rose-500/[0.04]"
                    : "bg-zinc-950/80 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border-zinc-850"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split layout: Input forms on left, results report on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Core Input Form Panel (Left side) */}
        <div className="col-span-1 lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4 font-mono text-xs">
          <span className="text-[10px] text-zinc-550 uppercase block tracking-wider flex items-center gap-1.5 leading-none font-sans">
            <Terminal className="w-4 h-4 text-rose-500" /> Audit Simulator Input
          </span>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 block uppercase">Post Title</label>
            <input
              type="text"
              placeholder="PASTE TEST POST TITLE HERE..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-200 placeholder-zinc-750 focus:outline-none focus:border-rose-500/40 font-mono text-xs"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 block uppercase">Thread Body or Comment Agglutination</label>
            <textarea
              placeholder="PASTE TEST DISCUSSION COMMENT FEED STREAM..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded text-zinc-200 placeholder-zinc-750 focus:outline-none focus:border-rose-500/45 font-mono text-xs"
              rows={8}
            />
          </div>

          {/* Preselected Rule context */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 block uppercase">Target Policy Context Rules</label>
            <select
              value={selectedRuleId}
              onChange={(e) => setSelectedRuleId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-350 focus:outline-none focus:border-rose-500/40 cursor-pointer"
            >
              <option value="">Auto-Detect (Scan and map guidelines automatically)</option>
              {policies.map(p => (
                <option key={p.id} value={p.id}>Rule {p.ruleNumber}: {p.name.slice(0, 30)}...</option>
              ))}
            </select>
          </div>

          {/* Warnings list helper */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/20 text-rose-400 border border-rose-950/40 rounded text-[10.5px]">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleRunAudit}
            disabled={isLoading}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs py-3 rounded transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 select-none border border-transparent"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isLoading ? "Running Analysis..." : "Run AI Audit"}
          </button>
        </div>

        {/* Results Reports display (Right side) */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          
          {isLoading ? (
            /* Cyber analysis loading indicators */
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-10 flex flex-col items-center justify-center space-y-4 h-[420px] font-mono text-xs text-zinc-500">
              <Activity className="w-8 h-8 text-rose-500 animate-spin" />
              
              <div className="text-center space-y-1">
                <p className="text-zinc-300 font-bold uppercase tracking-wider animate-pulse font-sans">Running Policy Analysis</p>
                <p className="text-zinc-500 text-[10px]">Evaluating post text against subreddit guidelines...</p>
              </div>

              {/* Incremental loading ticks */}
              <div className="w-72 bg-zinc-950 p-3 rounded border border-zinc-850 space-y-1 text-[9px] pl-4 font-sans">
                <p className={loadingStep >= 1 ? "text-emerald-400 pl-1 border-l border-emerald-500" : "text-zinc-750"}>
                  [1/3] Parsing inputs... {loadingStep >= 1 ? "OK" : ""}
                </p>
                <p className={loadingStep >= 2 ? "text-emerald-400 pl-1 border-l border-emerald-500" : "text-zinc-750"}>
                  [2/3] Checking trigger overlap... {loadingStep >= 2 ? "OK" : ""}
                </p>
                <p className={loadingStep >= 3 ? "text-emerald-400 pl-1 border-l border-emerald-500 w-full animate-pulse font-normal" : "text-zinc-750"}>
                  [3/3] Structuring recommended actions... {loadingStep >= 3 ? "RUNNING" : ""}
                </p>
              </div>
            </div>
          ) : analysisResult ? (
            /* Immersive detail report card */
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5 font-mono text-xs">
              
              <div className="flex justify-between items-start gap-4 border-b border-zinc-800 pb-3 leading-tight font-sans">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-semibold">AI Analysis Results</span>
                  <p className="text-[14px] font-bold text-zinc-150 block mt-1 tracking-tight font-mono">
                    {analysisResult.suggested_label}
                  </p>
                </div>
                <ThreatBadge level={analysisResult.severity as ThreatSeverity} />
              </div>

              {/* Brief summary quote */}
              <div className="p-3 bg-zinc-950 rounded border border-zinc-900 space-y-1 leading-snug">
                <span className="text-[9.5px] text-zinc-500 uppercase font-black tracking-wi flex items-center gap-1.5 font-sans">
                  <FileText className="w-3.5 h-3.5 text-rose-500" /> Extracted Claim / Theme
                </span>
                <p className="text-xs text-rose-400 font-bold leading-normal font-sans italic">
                  &ldquo;{analysisResult.narrative_summary}&rdquo;
                </p>
              </div>

              {/* Numerical risk indicators score bars */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950/50 rounded border border-zinc-850 font-mono text-[10px]">
                <div className="space-y-1">
                  <span className="text-zinc-500 block">Risk Level</span>
                  <span className="font-bold text-sm text-rose-400 block">{analysisResult.risk_score || 50}/100</span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 block">Brigade Probability</span>
                  <span className="font-bold text-sm text-zinc-250 block">{analysisResult.brigade_probability || 40}% Coordinated</span>
                </div>
                <div className="space-y-1 border-t border-zinc-850 pt-2 shrink-0">
                  <span className="text-zinc-500 block">Rule Breach Match</span>
                  <span className="font-bold text-xs uppercase block text-amber-500 truncate mt-0.5">
                    {analysisResult.violated_rule_id || "No breach"}
                  </span>
                </div>
                <div className="space-y-1 border-t border-zinc-850 pt-2">
                  <span className="text-zinc-500 block">Rule Match Confidence</span>
                  <span className="font-bold text-xs block text-zinc-350 mt-0.5">
                    {Math.floor((analysisResult.rule_match_confidence || 0.8) * 100)}% Match
                  </span>
                </div>
              </div>

              {/* Rationale recommendation container */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2.5">
                <label className="text-[10px] text-zinc-500 uppercase font-black tracking-wi flex items-center gap-1 leading-none font-sans font-bold">
                  🛡️ Moderation Advice
                </label>
                <div className="pt-1">
                  <ActionBadge action={analysisResult.recommended_action} />
                </div>
                <p className="text-[11px] font-sans text-zinc-400 leading-relaxed font-normal">
                  {analysisResult.rationale}
                </p>
              </div>

              {/* Deep Security explanation description */}
              <div className="space-y-1.5 border-t border-zinc-800 pt-4 leading-normal">
                <span className="text-[10px] text-zinc-500 uppercase font-black block tracking-wid flex items-center gap-1.5 font-sans font-bold">
                  <Compass className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> AI Explanation Overview
                </span>
                <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed font-normal bg-zinc-955 p-3 rounded.5 border border-zinc-850">
                  {analysisResult.explanatory_analysis}
                </p>
              </div>

              {/* Triage feedback banner */}
              <div className="bg-emerald-950/10 border border-emerald-950/20 p-3 rounded-lg text-center text-[10px] text-zinc-500 leading-normal font-sans">
                ✓ Recorded: This post analysis has been logged. You can view or manage it in the <strong>Incident Console</strong> or <strong>Overview</strong> dashboards.
              </div>

            </div>
          ) : (
            /* Empty state placeholder */
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 h-[420px] font-mono text-xs text-zinc-500">
              <Compass className="w-8 h-8 text-zinc-800" />
              <div className="text-center space-y-1 max-w-sm">
                <p className="text-zinc-400 font-bold uppercase tracking-wider">Awaiting Threat Inputs</p>
                <p className="leading-relaxed">
                  Fill in a custom subreddit thread or choose any preset above, and execute <strong>Run Narrative Audit</strong> to check active parameters.
                </p>
              </div>

              {/* API Configuration alert */}
              <div className="bg-zinc-950/80 p-4 border border-zinc-850/80 rounded-lg max-w-sm text-left leading-relaxed text-[10px] text-zinc-400 font-normal leading-normal">
                💡 <strong>API Config Info</strong>: We utilize lazy initialization to call the Gemini API server-side. If you have not configured a `GEMINI_API_KEY`, the firewall automatically operates in deterministic <strong>Fallback Simulation Mode</strong>, ensuring 100% stable, offline testing.
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
