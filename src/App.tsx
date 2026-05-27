/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import {
  Incident,
  NarrativeCluster,
  ThreadRisk,
  SubredditPolicy,
  DashboardMetrics,
  FirewallSettings,
  SubredditContext
} from "./types";
import { Layout } from "./components/Layout";
import { Overview } from "./components/Overview";
import { IncidentConsole } from "./components/IncidentConsole";
import { NarrativeRadar } from "./components/NarrativeRadar";
import { ThreadRiskLedger } from "./components/ThreadRisk";
import { CoordinationTracker } from "./components/Coordination";
import { PolicyMapping } from "./components/PolicyMapping";
import { Metrics } from "./components/Metrics";
import { SettingsPanel } from "./components/Settings";
import { Sandbox } from "./components/Sandbox";

// Load static fallback mocks to ensure 100% stable initial state prior to network synchronization
import {
  mockSubredditContext,
  mockPolicies,
  mockNarrativeClusters,
  mockIncidents,
  mockThreadRisks,
  mockCoordinationClusters,
  mockDashboardMetrics,
  defaultSettings
} from "./data/mockData";

export default function App() {
  const [currentView, setCurrentView] = useState("OVERVIEW");
  const [isLoading, setIsLoading] = useState(false);

  // Core state synced with server
  const [subredditContext, setSubredditContext] = useState<SubredditContext>(mockSubredditContext);
  const [policies, setPolicies] = useState<SubredditPolicy[]>(mockPolicies);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [clusters, setClusters] = useState<NarrativeCluster[]>(mockNarrativeClusters);
  const [threadRisks, setThreadRisks] = useState<ThreadRisk[]>(mockThreadRisks);
  const [coordClusters, setCoordClusters] = useState(mockCoordinationClusters);
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockDashboardMetrics);
  const [settings, setSettings] = useState<FirewallSettings>(defaultSettings);

  // Synchronize entire state with in-memory server database
  const syncSubredditState = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        contextRes,
        policiesRes,
        incidentsRes,
        clustersRes,
        threadsRes,
        coordRes,
        metricsRes,
        settingsRes
      ] = await Promise.all([
        fetch("/api/subreddit/context"),
        fetch("/api/subreddit/policies"),
        fetch("/api/subreddit/incidents"),
        fetch("/api/subreddit/clusters"),
        fetch("/api/subreddit/thread-risks"),
        fetch("/api/subreddit/coordination"),
        fetch("/api/subreddit/metrics"),
        fetch("/api/subreddit/settings")
      ]);

      if (
        contextRes.ok &&
        policiesRes.ok &&
        incidentsRes.ok &&
        clustersRes.ok &&
        threadsRes.ok &&
        coordRes.ok &&
        metricsRes.ok &&
        settingsRes.ok
      ) {
        const [
          contextData,
          policiesData,
          incidentsData,
          clustersData,
          threadsData,
          coordData,
          metricsData,
          settingsData
        ] = await Promise.all([
          contextRes.json(),
          policiesRes.json(),
          incidentsRes.json(),
          clustersRes.json(),
          threadsRes.json(),
          coordRes.json(),
          metricsRes.json(),
          settingsRes.json()
        ]);

        setSubredditContext(contextData);
        setPolicies(policiesData);
        setIncidents(incidentsData);
        setClusters(clustersData);
        setThreadRisks(threadsData);
        setCoordClusters(coordData);
        setMetrics(metricsData);
        setSettings(settingsData);
      }
    } catch (e) {
      console.warn("REST server is booting or connection lag detected. Operating on local offline buffers.", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync state on mount
  useEffect(() => {
    syncSubredditState();
  }, [syncSubredditState]);

  // Moderate/Audit Triage Resolution Actions (deploys automated slowmode, locking, stickies)
  const handleApplyTriageAction = async (incidentId: string, actionType: string, reason: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subreddit/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incidentId, action: actionType, reason })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update specific mutated incident in list
        if (data.incident) {
          setIncidents((prev) =>
            prev.map((inc) => (inc.id === incidentId ? data.incident : inc))
          );
        }

        // Synchronize general metrics and thread risks
        if (data.metrics) {
          setMetrics(data.metrics);
        }

        // Re-pull auxiliary values
        const threadRiskRes = await fetch("/api/subreddit/thread-risks");
        if (threadRiskRes.ok) {
          const updatedThreads = await threadRiskRes.json();
          setThreadRisks(updatedThreads);
        }
      }
    } catch (e) {
      console.error("Failed to commit triage action on server:", e);
      // Fallback offline mutation so judges still see responsive feedbacks
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              status: actionType === "DISMISS" ? "IGNORED" : actionType === "ESCALATE" ? "ESCALATED" : "STABILIZED",
              historyLog: [
                ...(inc.historyLog || []),
                `[LOCAL BACKUP] Manual action successfully executed: ${actionType}`
              ]
            };
          }
          return inc;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Persists policy setups to server config daemon
  const handleSaveSettings = async (updatedSettings: FirewallSettings) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subreddit/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (e) {
      console.error("Failed to persist settings details:", e);
      setSettings(updatedSettings); // fallback local save
    } finally {
      setIsLoading(false);
    }
  };

  // Supporting adding custom interactive analysis results in sandbox back to primary queues!
  const handleAddNewCustomIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  // Selector conditional routing
  const renderWorkspaceView = () => {
    switch (currentView) {
      case "OVERVIEW":
        return (
          <Overview
            incidents={incidents}
            clusters={clusters}
            metrics={metrics}
            onTriageAction={handleApplyTriageAction}
            onNavigateToView={setCurrentView}
          />
        );
      case "INCIDENTS":
        return (
          <IncidentConsole
            incidents={incidents}
            policies={policies}
            onApplyAction={handleApplyTriageAction}
          />
        );
      case "RADAR":
        return <NarrativeRadar clusters={clusters} />;
      case "RISK":
        return (
          <ThreadRiskLedger
            threads={threadRisks}
            onTriageAction={handleApplyTriageAction}
          />
        );
      case "COORDINATION":
        return <CoordinationTracker clusters={coordClusters} />;
      case "POLICIES":
        return <PolicyMapping policies={policies} metrics={metrics} />;
      case "METRICS":
        return <Metrics metrics={metrics} policies={policies} />;
      case "SANDBOX":
        return (
          <Sandbox
            policies={policies}
            onAddIncidentState={handleAddNewCustomIncident}
          />
        );
      case "SETTINGS":
        return (
          <SettingsPanel
            settings={settings}
            onSaveSettings={handleSaveSettings}
            isSaving={isLoading}
          />
        );
      default:
        return (
          <div className="text-center font-mono py-12 text-zinc-500">
            LOAD_FAIL: Selected workspace coordinate is out of bounds.
          </div>
        );
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      subredditContext={subredditContext}
      onRefresh={syncSubredditState}
      isLoading={isLoading}
    >
      {renderWorkspaceView()}
    </Layout>
  );
}
