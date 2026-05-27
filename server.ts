/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import {
  ThreatSeverity,
  IncidentStatus,
  ModerationAction,
  Incident,
  DashboardMetrics,
  FirewallSettings
} from "./src/types";

import {
  mockSubredditContext,
  mockPolicies,
  mockNarrativeClusters,
  mockIncidents,
  mockThreadRisks,
  mockCoordinationClusters,
  mockDashboardMetrics,
  defaultSettings
} from "./src/data/mockData";

// Load environment variables
dotenv.config();

// Initialize in-memory mutable DB initialized from realistic seeds
const state = {
  context: { ...mockSubredditContext },
  policies: [...mockPolicies],
  narrativeClusters: [...mockNarrativeClusters],
  incidents: [...mockIncidents],
  threadRisks: [...mockThreadRisks],
  coordinationClusters: [...mockCoordinationClusters],
  metrics: { ...mockDashboardMetrics },
  settings: { ...defaultSettings }
};

// Safe helper to increment metrics
function incrementStats(hours: number, savedIncidents: number, actionName: string) {
  state.metrics.incidentsFlagged += savedIncidents;
  state.metrics.threadsStabilized += savedIncidents;
  state.metrics.estimatedHoursSaved += hours;
  state.metrics.firewallDeploymentCount += 1;
  
  // Update today's metric in historical savings (last element)
  if (state.metrics.historicalSavings.length > 0) {
    const todayIndex = state.metrics.historicalSavings.length - 1;
    state.metrics.historicalSavings[todayIndex].hoursSaved += hours;
    state.metrics.historicalSavings[todayIndex].incidentsBlocked += savedIncidents;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());

  // Log requests in cyber ops style
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`[FIREWALL_MONITOR] ${new Date().toISOString()} | ${req.method} ${req.path}`);
    }
    next();
  });

  // ========== API ENDPOINTS ==========

  // 1. Subreddit Context
  app.get("/api/subreddit/context", (req, res) => {
    res.json(state.context);
  });

  // 2. Policies/Rules
  app.get("/api/subreddit/policies", (req, res) => {
    res.json(state.policies);
  });

  // 3. Incidents Feed
  app.get("/api/subreddit/incidents", (req, res) => {
    res.json(state.incidents);
  });

  // 4. Narrative Clusters
  app.get("/api/subreddit/clusters", (req, res) => {
    res.json(state.narrativeClusters);
  });

  // 5. Thread Risks
  app.get("/api/subreddit/thread-risks", (req, res) => {
    res.json(state.threadRisks);
  });

  // 6. Coordination clusters
  app.get("/api/subreddit/coordination", (req, res) => {
    res.json(state.coordinationClusters);
  });

  // 7. Overall dashboard metrics
  app.get("/api/subreddit/metrics", (req, res) => {
    res.json(state.metrics);
  });

  // 8. General Active Settings
  app.get("/api/subreddit/settings", (req, res) => {
    res.json(state.settings);
  });

  app.post("/api/subreddit/settings", (req, res) => {
    state.settings = { ...state.settings, ...req.body };
    res.json({ success: true, settings: state.settings });
  });

  // 9. Moderate and deploy firewall actions on an incident
  app.post("/api/subreddit/action", (req, res) => {
    const { incidentId, action, reason } = req.body;
    
    const incidentIndex = state.incidents.findIndex(inc => inc.id === incidentId);
    if (incidentIndex === -1) {
      return res.status(404).json({ error: "Incident not found" });
    }

    const originalIncident = state.incidents[incidentIndex];
    let timeSavedDelta = 0;
    let statusChange = IncidentStatus.STABILIZED;

    if (action === "DISMISS") {
      statusChange = IncidentStatus.IGNORED;
      timeSavedDelta = 0;
    } else if (action === "ESCALATE") {
      statusChange = IncidentStatus.ESCALATED;
      timeSavedDelta = 0.1; // 6 mins to notify admins
    } else {
      // Deployed firewall
      statusChange = IncidentStatus.STABILIZED;
      // Calculate realistic hours saved based on threat severity (high severity = more work)
      if (originalIncident.threatLevel === ThreatSeverity.CRITICAL) {
        timeSavedDelta = 1.5; // Saving 1.5 hrs of massive escalation/doxxing reviews
      } else if (originalIncident.threatLevel === ThreatSeverity.HIGH) {
        timeSavedDelta = 0.8; // 48 mins saved
      } else {
        timeSavedDelta = 0.4; // 24 mins saved
      }
    }

    // Mutate stateful list in-place
    const updatedIncident: Incident = {
      ...originalIncident,
      status: statusChange,
      historyLog: [
        ...(originalIncident.historyLog || []),
        `[${new Date().toLocaleTimeString()}] Action applied: ${action} by moderator. Rationale: ${reason || "Standard de-escalation protocol."}`
      ]
    };

    state.incidents[incidentIndex] = updatedIncident;

    // Stateful metrics escalation
    if (statusChange === IncidentStatus.STABILIZED) {
      incrementStats(timeSavedDelta, 1, action);
      
      // Update thread state if matching thread exists
      const threadIndex = state.threadRisks.findIndex(t => t.id === originalIncident.threadId);
      if (threadIndex !== -1) {
        state.threadRisks[threadIndex].status = "FIREWALL_ACTIVE";
        state.threadRisks[threadIndex].riskScore = Math.max(15, Math.floor(state.threadRisks[threadIndex].riskScore * 0.4)); // significantly stabilize risk score!
      }
    }

    res.json({ success: true, incident: updatedIncident, metrics: state.metrics });
  });

  // 10. Core AI-Powered Threat Analyzer via Gemini 3.5 Flash
  app.post("/api/analyze", async (req, res) => {
    const { title, text, selectedRuleId } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Title and content text are required for AI analysis." });
    }

    // Quick verification of API key
    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "";

    if (isMockMode) {
      console.log("[FIREWALL_MONITOR] | NO API KEY IDENTIFIED. Falling back to high-fidelity deterministic fallback model simulation.");
      
      // Seeded deterministic analyses based on input content to provide a highly realistic simulation!
      const contentLower = text.toLowerCase() + " " + title.toLowerCase();
      let matchedRuleId = selectedRuleId || "rule-1";
      let severity = ThreatSeverity.MEDIUM;
      let riskScore = 58;
      let label = "General Narrative Risk";
      let summary = "Unvouched discourse on technology ethics or operations";
      let recAction = ModerationAction.AUTO_STICKY;
      let prob = 35;
      let explanation = "Lacks structured citation, causing minor disagreement clusters. Recommend monitoring thread speed and injecting a calm discussion template as an auto-sticky.";
      let rationale = "Deploys a standard explanatory auto-sticky first. Keeping humans in control of heavy locks.";

      if (contentLower.includes("shortage") || contentLower.includes("scam") || contentLower.includes("cartel") || contentLower.includes("wafer")) {
        matchedRuleId = "rule-4"; // Technical Conspiracy
        severity = ThreatSeverity.HIGH;
        riskScore = 80;
        label = "Silicon Famine Narrative";
        summary = "Conspiratorial claim suggesting chip shortage is artificially engineered to inflate market valuations.";
        recAction = ModerationAction.AUTO_STICKY;
        prob = 84;
        explanation = "High similarity detected referencing engineered supply block narratives. Semantic components demonstrate targeted triggers matching hardware conspiracies. High coordination likelihood originating from commercial speculator threads.";
        rationale = "An automated sticky comment with official manufacturing ledger records will neutralize conspiratorial momentum before it triggers cascading manual user reports.";
      } else if (contentLower.includes("sentient") || contentLower.includes("silence") || contentLower.includes("harass") || contentLower.includes(" weights")) {
        matchedRuleId = "rule-1"; // Harassment
        severity = ThreatSeverity.CRITICAL;
        riskScore = 94;
        label = "AI Sentience Harassment Spurt";
        summary = "Aggressive calls to bombard developer staff and moderators to protest alleged sentient model censorship.";
        recAction = ModerationAction.LOCK_THREAD;
        prob = 91;
        explanation = "Direct targeting markers pointing to private staff vectors. Use of aggressive coordination metrics indicates targeted brigade triggers. High kinetic comments curve trajectory risk (+240% velocity).";
        rationale = "Direct target calls violate safety matrices instantly. Temporarily locking thread comments prevents massive moderator overhead and protects developer staff.";
      } else if (contentLower.includes("deepfake") || contentLower.includes("election") || contentLower.includes("voter") || contentLower.includes("sway")) {
        matchedRuleId = "rule-3"; // Geopolitical Disinfo
        severity = ThreatSeverity.HIGH;
        riskScore = 85;
        label = "Astroturfed Deepfake Generator Panic";
        summary = "Promotion and distribution of regional voter targeted synthetic image/speech injection tooling.";
        recAction = ModerationAction.CROWD_CONTROL;
        prob = 78;
        explanation = "Geopolitical threat vector identified designed to seed mistrust in local democratic processes. System indicators flag highly concentrated user account creation dates linked to campaign nodes.";
        rationale = "Enabling moderate Crowd Control restricts newly generated throwaways from funneling non-reviewed external GitHub or zip directories directly to our feed.";
      } else if (contentLower.includes("nexus") || contentLower.includes("insolvent") || contentLower.includes("bankrupt") || contentLower.includes(" FTX")) {
        matchedRuleId = "rule-2"; // Market Manipulation
        severity = ThreatSeverity.HIGH;
        riskScore = 76;
        label = "Exchange Solvency Contagion";
        summary = "Unvouched assertions claiming immediate exchange asset freezing, triggering panic sales and token dumping loops.";
        recAction = ModerationAction.SLOW_MODE;
        prob = 68;
        explanation = "Market contagion loops trigger emotional commentary panic. Heavy speculation on exchange custody registers threatens rules regarding pump-and-dump or panic-generation architectures.";
        rationale = "Deploying Comment Slow Mode (15s rate limit) forces panicking users to consider their feedback, cooling down toxic spam spirals and report queues.";
      }

      // Generate a mock stateful incident from this analysis & push to current queues so user sees it live!
      const newIncidentId = `inc-ai-${Date.now().toString().slice(-4)}`;
      const mockAnalysedIncident: Incident = {
        id: newIncidentId,
        threadId: `thread-ai-${Math.floor(Math.random() * 900 + 100)}`,
        threadTitle: title,
        threadUrl: "https://reddit.com/r/WorldTech/comments/ai_sandbox",
        author: req.body.author || "SandboxUser",
        contentType: "THREAD",
        contentSnippet: text,
        timestamp: new Date().toISOString(),
        threatLevel: severity,
        riskScore,
        narrativeClusterId: "cluster-custom",
        violatesRuleId: matchedRuleId,
        ruleMatchConfidence: 0.85 + Math.random() * 0.1,
        recommendedAction: {
          type: recAction,
          confidence: 0.88,
          rationale,
          appliedDirectly: false
        },
        status: IncidentStatus.PENDING,
        userReputationScore: 40,
        brigadeProbability: prob,
        historyLog: [
          `Captured in active Sandbox Simulation Mode (Gemini Sandbox Sandbox Mode)`,
          `Calculated risk factors pointing to narrative cluster match: ${label}`
        ]
      };

      // Stateful insert
      state.incidents.unshift(mockAnalysedIncident);

      return res.json({
        isMock: true,
        aiAnalysis: {
          narrative_summary: summary,
          suggested_label: label,
          severity,
          risk_score: riskScore,
          brigade_probability: prob,
          violated_rule_id: matchedRuleId,
          rule_match_confidence: 0.90,
          recommended_action: recAction,
          rationale,
          explanatory_analysis: explanation
        },
        createdIncident: mockAnalysedIncident
      });
    }

    try {
      // Lazy-initialization of our official client as requested with telemetry user-agent
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Inject details of active rules into the prompt to enable exact matching
      const rulesList = state.policies.map(p => `Rule ID: "${p.id}", Rule Name: "${p.name}", Description: "${p.description}"`).join("\n");

      const systemPrompt = `You are the core Narrative Intelligence Engine of "Narrative Firewall", a trust-and-safety social defense application designed for r/WorldTech moderators.
Analyze the user's submitted thread or comment text to capture underlying destabilizing narrative patterns that go beyond standard keywords or mechanical toxicity filters.

Our Active Subreddit Rules to map to:
${rulesList}

Analyze the Title and Content provided. Extract:
1. What deep narrative/belief system is fueling this discussion. Look for rumors, targeting plots, conspiracies, panic, coordination or astroturfing.
2. A short visual label for this narrative (3-5 words).
3. The threat severity level (LOW, MEDIUM, HIGH, CRITICAL).
4. A risk score out of 100 based on escalation likelihood, harassment potential, and disinformation risk.
5. Brigade probability (0-100) assessing if this looks like non-organic emotional influx.
6. The exact Rule ID violated (choose rule-1, rule-2, rule-3, rule-4, rule-5, or null if it does not violate any rule). Specify a confidence score for this rule mapping.
7. Recommend the lightest, most targeted effective moderation action: NONE, AUTO_STICKY, SLOW_MODE, LOCK_THREAD, CROWD_CONTROL, MOD_ALERT, or CONTENT_FILTER.
8. A practical, explainable rationale for why this moderation action is chosen and why it maintains de-escalation while protecting community discussions.
9. A highly professional, technical, cyber-security-intelligence styled brief outlining the semantic vector, susceptibility nodes, and linguistics used. Keep it dense, operational, and actionable.

You must reply with a valid JSON document matching the exact requested schema.`;

      const userMessage = `Title: "${title}"
Content Text: "${text}"
${selectedRuleId ? `Moderator Pre-selected Target Violation: ${selectedRuleId}` : ""}`;

      console.log("[FIREWALL_MONITOR] Invoking server-side Gemini 3.5 Flash for authentic narrative mapping...");

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              narrative_summary: { type: Type.STRING, description: "A highly concise sentence defining the underlying topic/conspiracy/rumour/brigade fueling the content." },
              suggested_label: { type: Type.STRING, description: "A compact 2-4 word tactical system label (e.g., 'Silcon Famine Myth', 'Staff Doxxing Spike')." },
              severity: { type: Type.STRING, description: "Severity level: LOW, MEDIUM, HIGH, or CRITICAL" },
              risk_score: { type: Type.INTEGER, description: "Calculated risk scoring out of 100" },
              brigade_probability: { type: Type.INTEGER, description: "Calculated coordination likelihood (0-100)" },
              violated_rule_id: { type: Type.STRING, description: "Rule id matching our list (rule-1, rule-2, rule-3, rule-4, rule-5) or null." },
              rule_match_confidence: { type: Type.NUMBER, description: "Confidence score for rule mapping (0.0 to 1.0)" },
              recommended_action: { type: Type.STRING, description: " लाइट moderation command: NONE, AUTO_STICKY, SLOW_MODE, LOCK_THREAD, CROWD_CONTROL, MOD_ALERT, or CONTENT_FILTER" },
              rationale: { type: Type.STRING, description: "Why this level is appropriate. Aim for lightest intervention first" },
              explanatory_analysis: { type: Type.STRING, description: "Trust and Safety intelligence-brief outlining narrative taxonomy, threat signals, and linguistic vectors." }
            },
            required: [
              "narrative_summary",
              "suggested_label",
              "severity",
              "risk_score",
              "brigade_probability",
              "violated_rule_id",
              "rule_match_confidence",
              "recommended_action",
              "rationale",
              "explanatory_analysis"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini server.");
      }

      const aiData = JSON.parse(responseText.trim());

      // Create a stateful incident so it maps instantly in our consoles!
      const newIncidentId = `inc-ai-${Date.now().toString().slice(-4)}`;
      const analysedIncident: Incident = {
        id: newIncidentId,
        threadId: `thread-ai-${Math.floor(Math.random() * 900 + 100)}`,
        threadTitle: title,
        threadUrl: "https://reddit.com/r/WorldTech/comments/ai_sandbox",
        author: "SandboxUser",
        contentType: "THREAD",
        contentSnippet: text,
        timestamp: new Date().toISOString(),
        threatLevel: (aiData.severity as ThreatSeverity) || ThreatSeverity.MEDIUM,
        riskScore: Number(aiData.risk_score) || 50,
        narrativeClusterId: "cluster-custom",
        violatesRuleId: aiData.violated_rule_id || undefined,
        ruleMatchConfidence: Number(aiData.rule_match_confidence) || 0.8,
        recommendedAction: {
          type: (aiData.recommended_action as ModerationAction) || ModerationAction.NONE,
          confidence: 0.90,
          rationale: aiData.rationale,
          appliedDirectly: false
        },
        status: IncidentStatus.PENDING,
        userReputationScore: 40,
        brigadeProbability: Number(aiData.brigade_probability) || 30,
        historyLog: [
          `Captured in active Sandbox Simulation Mode (Live Gemini Analysis Deployment)`,
          `Extracted semantic intelligence: ${aiData.narrative_summary}`
        ]
      };

      // Add to our main list so it automatically populates screens
      state.incidents.unshift(analysedIncident);

      res.json({
        isMock: false,
        aiAnalysis: aiData,
        createdIncident: analysedIncident
      });

    } catch (e: any) {
      console.error("[FIREWALL_MONITOR] AI Analysis Error:", e);
      res.status(500).json({ error: "Narrative engine analysis failed. Ensure API configuration is complete.", details: e.message });
    }
  });

  // ========== VITE MIDDLEWARE SETUP ==========

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`================================================================`);
    console.log(`🛡️  NARRATIVE FIREWALL SECURITY SECURE DAEMON STARTED            `);
    console.log(`🔗 Interface running on: http://localhost:${PORT}               `);
    console.log(`🛠️  Subreddit monitoring active: r/WorldTech [Database In-Memory]`);
    console.log(`================================================================`);
  });
}

startServer();
