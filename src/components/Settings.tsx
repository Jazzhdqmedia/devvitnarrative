/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FirewallSettings } from "../types";
import {
  Settings,
  Shield,
  Sliders,
  Sparkles,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  HelpCircle
} from "lucide-react";

interface SettingsProps {
  settings: FirewallSettings;
  onSaveSettings: (settings: FirewallSettings) => void;
  isSaving: boolean;
}

export const SettingsPanel: React.FC<SettingsProps> = ({
  settings,
  onSaveSettings,
  isSaving
}) => {
  const [isEnabled, setIsEnabled] = useState(settings.isEnabled);
  const [blockMode, setBlockMode] = useState(settings.blockMode);
  const [criticalRiskThreshold, setCriticalRiskThreshold] = useState(settings.criticalRiskThreshold);
  const [crowdControlLevel, setCrowdControlLevel] = useState(settings.crowdControlLevel);
  const [systemInstructionsPrompt, setSystemInstructionsPrompt] = useState(settings.systemInstructionsPrompt);
  const [pinnedMessageTemplate, setPinnedMessageTemplate] = useState(settings.pinnedMessageTemplate);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      isEnabled,
      blockMode,
      criticalRiskThreshold,
      crowdControlLevel,
      aiVerificationLevel: settings.aiVerificationLevel,
      systemInstructionsPrompt,
      pinnedMessageTemplate
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000); // clear after 3s
  };

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="border-b border-zinc-805 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-mono font-black tracking-tight text-white uppercase">
            FIREWALL_CONFIG_CENTER
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Tune automated thresholds, adjust the Narrative Intelligence prompt constraints, and edit Social Firewall sticky templates.
          </p>
        </div>
        
        {/* Toggle Indicator */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-500">DAEMON_STATE:</span>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition ${
              isEnabled ? "bg-emerald-600 justify-end" : "bg-zinc-800 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white transition hover:scale-105" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
        
        {/* Core parameters tuning factors (Left side) */}
        <div className="col-span-1 lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
          <span className="text-[10px] text-zinc-550 uppercase block tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-rose-500" /> THRESHOLDS_AND_TACTICAL_MODE
          </span>

          {/* Firewall mode */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 uppercase block">FIREWALL_EXECUTION_MODE</label>
            <select
              value={blockMode}
              onChange={(e: any) => setBlockMode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-350 focus:outline-none focus:border-rose-500/40 font-mono text-xs cursor-pointer"
            >
              <option value="RECOMMENDED">RECOMMENDED_ONLY (Humans confirm every action)</option>
              <option value="AUTOMATED">FULLY_AUTOMATED (AI directly executes locks/stickies)</option>
              <option value="HYBRID">HYBRID_SHIELD (Lock Critical threads directly; Recommend others)</option>
            </select>
          </div>

          {/* Slider risk trigger */}
          <div className="space-y-2 pt-2 border-t border-zinc-850">
            <div className="flex justify-between items-center whitespace-nowrap">
              <label className="text-zinc-500 uppercase block">Critical Risk Threshold</label>
              <span className="text-rose-400 font-bold font-semibold bg-rose-500/10 px-1.5 rounded">{criticalRiskThreshold}% RISK</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={criticalRiskThreshold}
              onChange={(e) => setCriticalRiskThreshold(Number(e.target.value))}
              className="w-full select-none cursor-ew-resize accent-rose-500 bg-zinc-950"
            />
            <p className="text-[10.5px] text-zinc-500 font-serif leading-tight">
              Threads scoring higher than this metric trigger immediate Slow Comment limits or lock overrides automatically in Hybrid and Automated states.
            </p>
          </div>

          {/* Crowd Control options */}
          <div className="space-y-1.5 border-t border-zinc-850 pt-4">
            <label className="text-zinc-500 uppercase block">CROWD_FILTER_RATINGS</label>
            <select
              value={crowdControlLevel}
              onChange={(e: any) => setCrowdControlLevel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-350 focus:outline-none focus:border-rose-500/40 cursor-pointer"
            >
              <option value="OFF">OFF (Allow all users)</option>
              <option value="LOW">LOW (Hold comments from brand new accounts under 1 day)</option>
              <option value="MEDIUM">MEDIUM (Filter commenters with low karma & non-subscribers)</option>
              <option value="HIGH">HIGH (Filter comment feeds; hold for manual moderator approval)</option>
            </select>
          </div>

        </div>

        {/* System prompts customizer and message templates (Right side) */}
        <div className="col-span-1 lg:col-span-6 bg-zinc-90 w-full space-y-4">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
            <span className="text-[10px] text-zinc-550 uppercase block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" /> NARRATIVE_AI_SYSTEM_RULES
            </span>
            <div className="space-y-1.5">
              <textarea
                value={systemInstructionsPrompt}
                onChange={(e) => setSystemInstructionsPrompt(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-[11px] font-mono leading-normal text-zinc-400 focus:outline-none focus:border-rose-500/30"
                rows={5}
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
            <span className="text-[10px] text-zinc-555 uppercase block flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> STICKY_MESSAGE_TEMPLATE
            </span>
            <div className="space-y-1.5">
              <textarea
                value={pinnedMessageTemplate}
                onChange={(e) => setPinnedMessageTemplate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded text-[10.5px] font-mono leading-relaxed text-zinc-400 focus:outline-none focus:border-rose-500/30"
                rows={6}
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 justify-end pt-2">
            {saveSuccess && (
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/10 px-2 py-1 rounded border border-emerald-950">
                ❇️ PARAMETERS PERSISTED TO SERVER MEMORY DB
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded transition cursor-pointer select-none border border-transparent"
            >
              {isSaving ? "MUTATING STATS..." : "COMMIT_ALL_CHANGES"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
