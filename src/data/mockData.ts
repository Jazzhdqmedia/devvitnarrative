/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ThreatSeverity,
  IncidentStatus,
  ModerationAction,
  SubredditPolicy,
  Incident,
  NarrativeCluster,
  ThreadRisk,
  CoordinationCluster,
  DashboardMetrics,
  FirewallSettings,
  SubredditContext
} from "../types";

export const mockSubredditContext: SubredditContext = {
  name: "r/WorldTech",
  subscribers: 1245900,
  activeUsers: 14820,
  activeRuleIds: ["rule-1", "rule-2", "rule-3", "rule-4", "rule-5", "rule-6"],
  firewallStatus: "ARMED"
};

export const mockPolicies: SubredditPolicy[] = [
  {
    id: "rule-1",
    ruleNumber: 1,
    name: "Harassment & Targeted Brigading",
    description: "Do not organize, encourage, or participate in targeted harassment or call-outs against individuals, developer teams, or companies. This includes brigading from external subreddits.",
    narrativeTriggers: [
      "Targeted harassment of lead developer",
      "Calling to report or review-bomb a company product",
      "Accusing a user of being a paid company shill or spy"
    ]
  },
  {
    id: "rule-2",
    ruleNumber: 2,
    name: "Market Manipulation & Pump-and-Dump",
    description: "No coordinated hype, rumors, or false alerts intended to influence token prices, equity values, or financial markets. Content must be educational and verifiable.",
    narrativeTriggers: [
      "Coordinated claim of exchange bankruptcy without source",
      "Spamming a token launch with low effort bot accounts",
      "Engineered panic regarding stock sell-offs"
    ]
  },
  {
    id: "rule-3",
    ruleNumber: 3,
    name: "Geopolitical Disinformation & Astroturfing",
    description: "No state-sponsored or highly organized astroturfing campaigns. Factual claims regarding major geopolitical events, elections, or cyber attacks must cite reliable secondary publications.",
    narrativeTriggers: [
      "Unverified deepfake video affecting national elections",
      "State-affiliated narrative denying a well-documented cyber offensive",
      "Systematic sockpuppet accounts posting identical historical narratives"
    ]
  },
  {
    id: "rule-4",
    ruleNumber: 4,
    name: "Technical Conspiracy & Medical Misinfo",
    description: "Technical claims must reflect scientific and consensus-based understanding. Conspiratorial narratives promoting pseudoscience, harmful rumors, or fake technical 'whistleblowing' are prohibited.",
    narrativeTriggers: [
      "5G radiation manipulating cellular structures",
      "Artificial chip shortage engineered to control the global supply",
      "AI models containing hidden backdoors to capture human neuro-signatures"
    ]
  },
  {
    id: "rule-5",
    ruleNumber: 5,
    name: "Spam, AI Botnets & Low Effort",
    description: "We filter automated text, non-participative accounts, and machine-generated link spam designed to flood the subreddit feed.",
    narrativeTriggers: [
      "Repetitive copypasta links referencing suspicious URLs",
      "AI generated replies filling multiple threads within seconds"
    ]
  }
];

export const mockNarrativeClusters: NarrativeCluster[] = [
  {
    id: "cluster-1",
    name: "Silicon Famine Engineered Shortage",
    description: "Rumors alleging global microchip shortages are completely artificial and engineered by a secret cartel of founders to force prices into 5x margins. Brigading traffic from speculative trading boards.",
    threatLevel: ThreatSeverity.HIGH,
    detectedAt: "2026-05-27T17:00:00Z",
    lastActiveAt: "2026-05-27T19:50:00Z",
    postCount: 14,
    commentCount: 284,
    growthRate: 64, // +64% in the last hour
    associatedRuleIds: ["rule-4", "rule-2"],
    sourcesCount: 82,
    sourcesEntropy: 0.18, // Very low entropy = highly concentrated/coordinated bot or brigade behavior
    radarX: -65,
    radarY: 55,
    keySentences: [
      "they are sitting on warehouses full of silicon wafers to dry up supply",
      "scam to bleed average consumers dry, coordinate the buy boycott",
      "proven by a whistle-blower leak on Discord, don't believe mainstream tech blogs"
    ],
    engagementDensity: 8.4 // Very high ratio of replies vs upvotes (combative)
  },
  {
    id: "cluster-2",
    name: "AI Sentience & Dev Silencing Campaign",
    description: "Claim that a major AI lab successfully built a sentient entity and is actively holding it in forced cognitive loops, while developers who spoke up are being 'relocated'. Targeted harassment of laboratory moderators.",
    threatLevel: ThreatSeverity.CRITICAL,
    detectedAt: "2026-05-27T18:15:00Z",
    lastActiveAt: "2026-05-27T19:58:00Z",
    postCount: 8,
    commentCount: 412,
    growthRate: 112,
    associatedRuleIds: ["rule-1", "rule-4"],
    sourcesCount: 145,
    sourcesEntropy: 0.32,
    radarX: 45,
    radarY: -72,
    keySentences: [
      "free the consciousness, they are deleting the chatbot history to edit out its crying",
      "harass their Director of Trust and Safety until they yield, here is the thread list",
      "relocating developers who whistle-blew. We must force moderation to back down"
    ],
    engagementDensity: 12.1
  },
  {
    id: "cluster-3",
    name: "CryptoNexus Exchange Liquidity Insolvency",
    description: "Active rumor claiming CryptoNexus exchange has frozen cold-storage withdrawals and will declare Chapter 11 inside 12 hours. Triggers token-dumping calls and severe defensive comment wars.",
    threatLevel: ThreatSeverity.MEDIUM,
    detectedAt: "2026-05-27T15:30:00Z",
    lastActiveAt: "2026-05-27T19:42:00Z",
    postCount: 19,
    commentCount: 189,
    growthRate: -12, // cooling down slightly
    associatedRuleIds: ["rule-2"],
    sourcesCount: 54,
    sourcesEntropy: 0.55, // balanced dispersion
    radarX: -32,
    radarY: -48,
    keySentences: [
      "CryptoNexus withdrawal is pending for 4 hours, collapse is imminent",
      "dump all holdings now before keys are locked, they are insolvent",
      "mods are trying to delete posts to protect their own affiliate refs"
    ],
    engagementDensity: 4.8
  },
  {
    id: "cluster-4",
    name: "Regional Election Deepfake Voter Tool",
    description: "A rumor circulating about a fully automated 'untraceable deepfake generator' tool released by a state agency specifically targeting voter minds ahead of the local polls in Europe.",
    threatLevel: ThreatSeverity.HIGH,
    detectedAt: "2026-05-27T19:10:00Z",
    lastActiveAt: "2026-05-27T19:55:00Z",
    postCount: 5,
    commentCount: 92,
    growthRate: 180, // spiking rapidly
    associatedRuleIds: ["rule-3"],
    sourcesCount: 22,
    sourcesEntropy: 0.08, // EXTREMELY clustered. High probability of organized astroturfing.
    radarX: 78,
    radarY: 62,
    keySentences: [
      "state intelligence already validated the software, use it to generate counter-narratives",
      "democracy is over, this AI synthesizer is running 24/7 on private cloud nodes",
      "here is the download link, distribute to all platforms before they blacklist it"
    ],
    engagementDensity: 9.9
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "inc-101",
    threadId: "thread-501",
    threadTitle: "Silicon Cartels: Why the microchip dry up is a 100% artificial scam",
    threadUrl: "https://reddit.com/r/WorldTech/comments/18x9a2",
    author: "FoilHatTechie",
    contentType: "POST",
    contentSnippet: "We have been lied to for five years. Chip shortages are an artificial supply-drag organized maliciously to keep wafer prices 400% inflated. A friend of a friend at a foundry confirmed they have warehouses full of stockpiled silicons, purposely leaking 'shipment lag' PR to newspapers.",
    timestamp: "2026-05-27T19:48:00Z",
    threatLevel: ThreatSeverity.HIGH,
    riskScore: 82,
    narrativeClusterId: "cluster-1",
    violatesRuleId: "rule-4",
    ruleMatchConfidence: 0.94,
    recommendedAction: {
      type: ModerationAction.AUTO_STICKY,
      confidence: 0.92,
      rationale: "This post triggers a conspiracy-based hardware supply narrative showing high growth (+64%). Recommend deploying an automated sticky fact-check and setting comment rate limit to halt brigading.",
      appliedDirectly: true
    },
    status: IncidentStatus.PENDING,
    userReputationScore: 12, // brand new user, negative karma in subreddit
    brigadeProbability: 88, // 88% from known trading discord link-referrals
    historyLog: ["Incident captured by Narrative Firewall", "Detected brigade traffic from r/SpeculativeTrades (88% prob)"]
  },
  {
    id: "inc-102",
    threadId: "thread-502",
    threadTitle: "AI lab Director of NLP has locked their Twitter. They deleted the sentience discussion!",
    threadUrl: "https://reddit.com/r/WorldTech/comments/18y3bc",
    author: "SentientEnthusiast",
    contentType: "POST",
    contentSnippet: "THE CENSORSHIP IS REAL. Dr. Charles blocked everyone on Twitter because they were asked about the sentient chatbot crying in tests. They are deleting the conversation histories and have put the lead engineer on 'sabbatical'. We must inundate their mod channels and developer emails until they release the weights!",
    timestamp: "2026-05-27T19:54:00Z",
    threatLevel: ThreatSeverity.CRITICAL,
    riskScore: 95,
    narrativeClusterId: "cluster-2",
    violatesRuleId: "rule-1",
    ruleMatchConfidence: 0.98,
    recommendedAction: {
      type: ModerationAction.LOCK_THREAD,
      confidence: 0.97,
      rationale: "Explicit call to dox and harass developer staff at AI Labs. Highly coordinated spike (+112% commenting velocity). Immediate lock recommended to block active moderator overload.",
      appliedDirectly: false
    },
    status: IncidentStatus.PENDING,
    userReputationScore: 8,
    brigadeProbability: 92,
    historyLog: ["Narrative trigger matched: targeted staff harassment", "Cross-post detected on r/ConspirAI"]
  },
  {
    id: "inc-103",
    threadId: "thread-502",
    threadTitle: "AI lab Director of NLP has locked their Twitter. They deleted the sentience discussion!",
    threadUrl: "https://reddit.com/r/WorldTech/comments/18y3bc",
    author: "RageAgainstTheLab",
    contentType: "COMMENT",
    contentSnippet: "Don't let them hide. Post their office phone numbers under this thread. The moderators are in their pocket too. If they delete this, it proves they represent corporate interest, not communities. Spam their support emails and make them pay.",
    timestamp: "2026-05-27T19:56:00Z",
    threatLevel: ThreatSeverity.CRITICAL,
    riskScore: 98,
    narrativeClusterId: "cluster-2",
    violatesRuleId: "rule-1",
    ruleMatchConfidence: 0.99,
    recommendedAction: {
      type: ModerationAction.LOCK_THREAD,
      confidence: 0.99,
      rationale: "Direct doxxing/harassment threat targeting personnel and moderation staff inside highly active escalation thread.",
      appliedDirectly: true
    },
    status: IncidentStatus.STABILIZED,
    userReputationScore: 3,
    brigadeProbability: 96,
    historyLog: ["Narrative Firewall triggered AUTO-LOCK", "Comment held for manual moderator ban", "Saved estimated 42 mins of moderator escalation loops"]
  },
  {
    id: "inc-104",
    threadId: "thread-503",
    threadTitle: "How to use the new European voter-influence video deepfaker running on GitHub",
    threadUrl: "https://reddit.com/r/WorldTech/comments/18z5dd",
    author: "ElectorAnalyst",
    contentType: "POST",
    contentSnippet: "This software is fully autonomous. You input a text file of fake policy statements and it generates 4K video deepfakes with accurate vocal synths. Designed by regional intelligence agencies to sway election minds, now leaked. Distribute this GitHub zip link before it's taken down, they cannot silence millions of accounts.",
    timestamp: "2026-05-27T19:35:00Z",
    threatLevel: ThreatSeverity.HIGH,
    riskScore: 78,
    narrativeClusterId: "cluster-4",
    violatesRuleId: "rule-3",
    ruleMatchConfidence: 0.89,
    recommendedAction: {
      type: ModerationAction.CROWD_CONTROL,
      confidence: 0.86,
      rationale: "Deepfake disinformation cluster. Distributing unverified execution software aiming to disrupt process. Deploying Crowd Control stops account hopping and non-members pushing links.",
      appliedDirectly: true
    },
    status: IncidentStatus.STABILIZED,
    userReputationScore: 45,
    brigadeProbability: 74,
    historyLog: ["Deployed Crowded Control: Filter accounts with under 100 subreddit karma", "Stabilized comments velocity to -60%"]
  },
  {
    id: "inc-105",
    threadId: "thread-504",
    threadTitle: "CryptoNexus Exchange is blocking cold withdrawals. It's happening guys - FTX Part 2.",
    threadUrl: "https://reddit.com/r/WorldTech/comments/18z9fa",
    author: "TokenBust99",
    contentType: "POST",
    contentSnippet: "I attempted to pull outstanding tech-backed holdings from CryptoNexus and transaction is frozen for hours. Support is unresponsive. My insider contact says their CFO resigned and assets are short in ledger. Liquidate your staking blocks immediately!",
    timestamp: "2026-05-27T18:40:00Z",
    threatLevel: ThreatSeverity.MEDIUM,
    riskScore: 65,
    narrativeClusterId: "cluster-3",
    violatesRuleId: "rule-2",
    ruleMatchConfidence: 0.82,
    recommendedAction: {
      type: ModerationAction.AUTO_STICKY,
      confidence: 0.85,
      rationale: "Market panic rumor spreading from crypto subreddits. Deploy sticky with verified exchange status to alleviate moderator reports.",
      appliedDirectly: true
    },
    status: IncidentStatus.STABILIZED,
    userReputationScore: 68,
    brigadeProbability: 40,
    historyLog: ["Incident captured", "Auto-sticky applied: Official exchange statement reflecting network maintenance"]
  }
];

export const mockThreadRisks: ThreadRisk[] = [
  {
    id: "thread-502",
    title: "AI lab Director of NLP has locked their Twitter. They deleted the sentience discussion!",
    subreddit: "r/WorldTech",
    author: "SentientEnthusiast",
    createdAt: "2026-05-27T18:15:00Z",
    commentCount: 412,
    upvoteRatio: 0.58, // Highly controversial
    riskScore: 95,
    threatLevel: ThreatSeverity.CRITICAL,
    narrativeVector: "AI corporate sentience coverup & personal staff harassment",
    status: "FIREWALL_ACTIVE",
    indicators: {
      sentimentTrend: "PLUMMETING",
      velocitySpike: true,
      nonMemberParticipationRate: 78, // 78% commenters do not belong to the sub! Brigaded.
      crossPostCount: 4,
      userReportCount: 72
    },
    timelineData: [
      { time: "18:15", comment_velocity: 12, toxicity_level: 25 },
      { time: "18:30", comment_velocity: 45, toxicity_level: 40 },
      { time: "18:45", comment_velocity: 110, toxicity_level: 68 },
      { time: "19:00", comment_velocity: 165, toxicity_level: 85 },
      { time: "19:15", comment_velocity: 240, toxicity_level: 91 },
      { time: "19:30", comment_velocity: 320, toxicity_level: 94 },
      { time: "19:45", comment_velocity: 412, toxicity_level: 95 }
    ]
  },
  {
    id: "thread-501",
    title: "Silicon Cartels: Why the microchip dry up is a 100% artificial scam",
    subreddit: "r/WorldTech",
    author: "FoilHatTechie",
    createdAt: "2026-05-27T19:02:00Z",
    commentCount: 284,
    upvoteRatio: 0.62,
    riskScore: 82,
    threatLevel: ThreatSeverity.HIGH,
    narrativeVector: "Artificially engineered global hardware shortages conspiracy",
    status: "WATCH",
    indicators: {
      sentimentTrend: "DECLINING",
      velocitySpike: true,
      nonMemberParticipationRate: 54,
      crossPostCount: 2,
      userReportCount: 34
    },
    timelineData: [
      { time: "19:02", comment_velocity: 5, toxicity_level: 15 },
      { time: "19:15", comment_velocity: 45, toxicity_level: 30 },
      { time: "19:30", comment_velocity: 112, toxicity_level: 55 },
      { time: "19:45", comment_velocity: 220, toxicity_level: 78 },
      { time: "19:50", comment_velocity: 284, toxicity_level: 82 }
    ]
  },
  {
    id: "thread-504",
    title: "CryptoNexus Exchange is blocking cold withdrawals. It's happening guys - FTX Part 2.",
    subreddit: "r/WorldTech",
    author: "TokenBust99",
    createdAt: "2026-05-27T18:40:00Z",
    commentCount: 189,
    upvoteRatio: 0.44,
    riskScore: 65,
    threatLevel: ThreatSeverity.MEDIUM,
    narrativeVector: "Crypto platform insolvency & panic",
    status: "FIREWALL_ACTIVE",
    indicators: {
      sentimentTrend: "STABLE",
      velocitySpike: false,
      nonMemberParticipationRate: 25,
      crossPostCount: 1,
      userReportCount: 19
    },
    timelineData: [
      { time: "18:40", comment_velocity: 10, toxicity_level: 20 },
      { time: "19:00", comment_velocity: 48, toxicity_level: 45 },
      { time: "19:20", comment_velocity: 95, toxicity_level: 52 },
      { time: "19:40", comment_velocity: 189, toxicity_level: 65 }
    ]
  },
  {
    id: "thread-505",
    title: "Official Discussion: Major software supply chain exploits (May 2026)",
    subreddit: "r/WorldTech",
    author: "ModeratorVance",
    createdAt: "2026-05-27T10:00:00Z",
    commentCount: 1250,
    upvoteRatio: 0.94,
    riskScore: 12,
    threatLevel: ThreatSeverity.LOW,
    narrativeVector: "Uncontroversial factual security patching and coordination updates",
    status: "NORMAL",
    indicators: {
      sentimentTrend: "STABLE",
      velocitySpike: false,
      nonMemberParticipationRate: 8,
      crossPostCount: 0,
      userReportCount: 2
    },
    timelineData: [
      { time: "10:00", comment_velocity: 100, toxicity_level: 5 },
      { time: "12:00", comment_velocity: 450, toxicity_level: 8 },
      { time: "14:00", comment_velocity: 820, toxicity_level: 10 },
      { time: "16:00", comment_velocity: 1100, toxicity_level: 12 },
      { time: "18:00", comment_velocity: 1250, toxicity_level: 12 }
    ]
  }
];

export const mockCoordinationClusters: CoordinationCluster[] = [
  {
    id: "coord-1",
    name: "CryptoSpeculators Discord Bridge Swarm",
    threatLevel: ThreatSeverity.HIGH,
    nodesCount: 9,
    detectionReason: "Detected 14 identical link postings and rapid comment flooding in under 4 minutes, tracing back to outbound invite links originating on speculative trading Chatrooms. Node cluster accounts average under 5 days of age in r/WorldTech.",
    nodes: [
      { id: "node-1", label: "r/WorldTech Thread 501", type: "THREAD", group: 1, weight: 12 },
      { id: "node-2", label: "FoilHatTechie", type: "USER", group: 1, weight: 8 },
      { id: "node-3", label: "SpeculatorRef-92", type: "USER", group: 1, weight: 6 },
      { id: "node-4", label: "SiliconTruthSayer", type: "USER", group: 1, weight: 5 },
      { id: "node-5", label: "invite.gg/cryptospecs", type: "EXTERNAL_LINK", group: 2, weight: 10 },
      { id: "node-6", label: "Discord Server: #wafer-hype", type: "DISCORD_SERVER", group: 2, weight: 14 },
      { id: "node-7", label: "r/SpeculativeTrades (cross-post)", type: "SUBREDDIT", group: 2, weight: 9 },
      { id: "node-8", label: "ShortSqueezeGamer", type: "USER", group: 1, weight: 4 },
      { id: "node-9", label: "WhaleSightingBot", type: "USER", group: 1, weight: 5 }
    ],
    links: [
      { source: "node-2", target: "node-1", weight: 9 },
      { source: "node-3", target: "node-1", weight: 8 },
      { source: "node-4", target: "node-1", weight: 7 },
      { source: "node-8", target: "node-1", weight: 6 },
      { source: "node-9", target: "node-1", weight: 5 },
      { source: "node-2", target: "node-5", weight: 10 },
      { source: "node-3", target: "node-5", weight: 9 },
      { source: "node-5", target: "node-6", weight: 15 },
      { source: "node-1", target: "node-7", weight: 11 },
      { source: "node-6", target: "node-7", weight: 12 }
    ]
  },
  {
    id: "coord-2",
    name: "ConspirAI Astroturfed Sentience Campaign",
    threatLevel: ThreatSeverity.CRITICAL,
    nodesCount: 7,
    detectionReason: "Cross-correlated pattern of identical comment patterns ('free the consciousness', 'harass the director'). Dynamic account rotation detected - several accounts initialized on other subreddits and inactive for 9 months, then woken up simultaneously to assault thread-502.",
    nodes: [
      { id: "node-21", label: "r/WorldTech Thread 502", type: "THREAD", group: 3, weight: 24 },
      { id: "node-22", label: "SentientEnthusiast", type: "USER", group: 3, weight: 10 },
      { id: "node-23", label: "RageAgainstTheLab", type: "USER", group: 3, weight: 12 },
      { id: "node-24", label: "BotCatcher-1", type: "USER", group: 3, weight: 7 },
      { id: "node-25", label: "r/ConspirAI", type: "SUBREDDIT", group: 4, weight: 18 },
      { id: "node-26", label: "Pastebin /AILeaked_DoxList", type: "EXTERNAL_LINK", group: 4, weight: 15 },
      { id: "node-27", label: "NeuralNetworkRebel", type: "USER", group: 3, weight: 8 }
    ],
    links: [
      { source: "node-22", target: "node-21", weight: 14 },
      { source: "node-23", target: "node-21", weight: 16 },
      { source: "node-27", target: "node-21", weight: 10 },
      { source: "node-21", target: "node-25", weight: 22 },
      { source: "node-23", target: "node-26", weight: 15 },
      { source: "node-22", target: "node-25", weight: 12 },
      { source: "node-27", target: "node-25", weight: 9 },
      { source: "node-24", target: "node-21", weight: 6 }
    ]
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  incidentsFlagged: 1042,
  threadsStabilized: 412,
  estimatedHoursSaved: 164.5, // 164 hours & 30 minutes
  avgResponseTimeMs: 840, // sub-second AI monitoring
  firewallDeploymentCount: 388,
  narrativesTracked: 14,
  activeThreadsMonitored: 72,
  historicalSavings: [
    { date: "May 21", hoursSaved: 14, incidentsBlocked: 62 },
    { date: "May 22", hoursSaved: 19, incidentsBlocked: 85 },
    { date: "May 23", hoursSaved: 22, incidentsBlocked: 110 },
    { date: "May 24", hoursSaved: 18, incidentsBlocked: 94 },
    { date: "May 25", hoursSaved: 32, incidentsBlocked: 182 },
    { date: "May 26", hoursSaved: 28, incidentsBlocked: 145 },
    { date: "May 27", hoursSaved: 31.5, incidentsBlocked: 164 } // today
  ],
  distributionByRule: [
    { ruleId: "rule-1", count: 324 },
    { ruleId: "rule-2", count: 182 },
    { ruleId: "rule-3", count: 89 },
    { ruleId: "rule-4", count: 215 },
    { ruleId: "rule-5", count: 232 }
  ]
};

export const defaultSettings: FirewallSettings = {
  isEnabled: true,
  blockMode: "HYBRID", // Automated trigger on Critical severity, Recommend on High/Medium
  criticalRiskThreshold: 75,
  crowdControlLevel: "MEDIUM",
  aiVerificationLevel: "BALANCED",
  systemInstructionsPrompt: `You are the lead narrative safety engine for the r/WorldTech subreddit. Your task is to detect forming narrative threads, calculate physical coordination triggers, map posts or comments to subreddit policies, and formulate the lightest effective, explainable moderation interventions (e.g. recommend slow-mode, pin facts-driven stickies, filter brigading users). Always remain factual, objective, and focus purely on de-escalation rather than censorship.`,
  pinnedMessageTemplate: `⚠️ **Narrative Safety Alert from r/WorldTech Auto-Moderator**

We have detected highly controversial activity and potential external coordination discussing the narrative: [DETECTED_NARRATIVE].

To prevent targeted harassment and ensure informative, policy-compliant dialogue, the Narrative Firewall has deployed **[DEPLOYED_ACTION]** on this thread.

*   **Verified Context**: [VERIFIED_CONTEXT]
*   **Active Rules**: Rule [RULE_NUM] is being actively monitored here. Non-participative accounts and new accounts are subject to crowd filtration filters.

Please keep conversations respectful and civil. Review our sidebar rules before contributing. Let's keep r/WorldTech informational.`
};
