/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  Radar,
  Users,
  Settings,
  BookOpen,
  BarChart3,
  Flame,
  LayoutDashboard,
  Terminal,
  RefreshCw,
  Sliders,
  Menu,
  X
} from "lucide-react";
import { SubredditContext } from "../types";

interface LayoutProps {
  currentView: string;
  onViewChange: (view: string) => void;
  subredditContext: SubredditContext;
  onRefresh: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentView,
  onViewChange,
  subredditContext,
  onRefresh,
  isLoading,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "OVERVIEW", label: "Overview", icon: LayoutDashboard },
    { id: "INCIDENTS", label: "Incidents", icon: ShieldAlert, alertCountKey: "pendingIncidents" },
    { id: "RADAR", label: "Narrative Radar", icon: Radar },
    { id: "RISK", label: "Thread Risks", icon: Flame },
    { id: "COORDINATION", label: "Coordination", icon: Users },
    { id: "POLICIES", label: "Policies", icon: BookOpen },
    { id: "METRICS", label: "Impact & Analytics", icon: BarChart3 },
    { id: "SANDBOX", label: "AI Sandbox", icon: Terminal, highlight: true },
    { id: "SETTINGS", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased selection:bg-rose-500/30 selection:text-white">
      {/* 🚀 Tactical Header */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 md:px-5 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-2.5 md:gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 w-9 h-9 rounded text-zinc-300 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>

          <div className="flex items-center justify-center bg-rose-500/10 border border-rose-500/30 w-8 h-8 rounded shrink-0">
            <Flame className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-mono tracking-tight font-black text-[13px] sm:text-sm uppercase text-zinc-100">
                Narrative Firewall
              </span>
              <span className="text-[9px] sm:text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-mono font-bold font-semibold uppercase tracking-wider">
                DEVVIT
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase hidden sm:block">
              RE_MOD_TOOLS_HACKATHON
            </p>
          </div>
        </div>

        {/* 🎛️ Operational Telemetry */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Subreddit context detail */}
          <div className="hidden lg:flex items-center gap-4 border-r border-zinc-805 pr-5 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block leading-none">Subreddit</span>
              <span className="text-xs text-rose-400 font-bold font-semibold">{subredditContext.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block leading-none">Members</span>
              <span className="text-xs text-zinc-300 font-bold">
                {(subredditContext.subscribers / 1e6).toFixed(2)}M
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block leading-none">Active Users</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {subredditContext.activeUsers.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Action/Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-800 hover:text-white border border-zinc-700/80 px-2 md:px-2.5 py-1.5 rounded text-[10.5px] sm:text-xs font-mono font-medium transition cursor-pointer disabled:opacity-50 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">RE-SYNC</span>
            </button>

            {/* Firewall Armed Banner */}
            <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-950/45 px-2.5 py-1.5 rounded text-[10.5px] sm:text-xs font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 select-none animate-pulse shrink-0" />
              <span className="text-emerald-400 uppercase text-[10px] sm:text-[11px] tracking-wider hidden xs:inline">Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* 💻 Main Window Grid */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu backdrop overlay */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-backdrop"
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 🧭 Left-rail Navigation Drawer */}
        <aside
          className={`fixed md:static inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-855 flex flex-col shrink-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-3 border-b border-zinc-800">
            <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800 flex items-center justify-between font-mono">
              <div>
                <span className="text-[9px] text-zinc-500 block leading-tight">MODERATION CONSOLE</span>
                <span className="text-xs font-bold text-zinc-300">CORE DOCK</span>
              </div>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-left transition text-xs font-mono cursor-pointer ${
                    isActive
                      ? "bg-rose-500/10 text-rose-400 border-l-2 border-rose-500 font-bold"
                      : item.highlight
                      ? "bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 border border-dashed border-amber-500/20"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-sans font-medium text-[12.5px] tracking-wide">
                    <IconComponent className={`w-4 h-4 ${isActive ? "text-rose-500" : item.highlight ? "text-amber-500" : "text-zinc-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "INCIDENTS" && (
                    <span className="bg-zinc-950 px-1.5 py-0.1 border border-zinc-800 rounded font-bold font-mono text-[10px] text-rose-500">
                      LIVE
                    </span>
                  )}
                  {isActive && <Sliders className="w-3.5 h-3.5 text-rose-500 opacity-60" />}
                </button>
              );
            })}
          </nav>

          {/* Footer operational diagnostic */}
          <div className="p-3 border-t border-zinc-850 shrink-0 bg-zinc-950/30">
            <div className="p-3 rounded bg-zinc-950/40 border border-zinc-855 font-mono text-[10px] text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-500 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Firewall:</span>
                <span className="text-emerald-500 font-bold">ARMED</span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span className="text-zinc-450 font-bold">0.84ms</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 📊 Active Workspace Viewport */}
        <main className="flex-1 bg-zinc-950 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
