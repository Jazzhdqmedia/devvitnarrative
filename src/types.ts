/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ThreatSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum IncidentStatus {
  UNDETECTED = "UNDETECTED",
  PENDING = "PENDING", // Needs mod review
  STABILIZED = "STABILIZED", // Automatically or manually resolved
  IGNORED = "IGNORED", // False positive
  ESCALATED = "ESCALATED" // Escalated to admins or full lock
}

export enum ModerationAction {
  NONE = "NONE",
  AUTO_STICKY = "AUTO_STICKY", // Recommend or apply a facts-pinned sticky comment
  SLOW_MODE = "SLOW_MODE", // Turn on comment rate limits
  LOCK_THREAD = "LOCK_THREAD", // Temporarily close comments
  CROWD_CONTROL = "CROWD_CONTROL", // Filter comments from non-subscribers/new accounts
  MOD_ALERT = "MOD_ALERT", // Highlight in mod queue
  CONTENT_FILTER = "CONTENT_FILTER" // Automatically filter specific keyword/narrative patterns
}

export interface RecommendedAction {
  type: ModerationAction;
  confidence: number; // 0.0 to 1.0 AI assessment
  rationale: string;
  appliedDirectly: boolean;
}

export interface SubredditPolicy {
  id: string;
  ruleNumber: number;
  name: string;
  description: string;
  narrativeTriggers: string[]; // Examples of triggering narratives
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Incident {
  id: string;
  threadId: string;
  threadTitle: string;
  threadUrl: string;
  author: string;
  contentType: "POST" | "COMMENT" | "THREAD";
  contentSnippet: string;
  subContentSnippet?: string; // Additional context (e.g., surrounding comments)
  timestamp: string; // ISO string
  threatLevel: ThreatSeverity;
  riskScore: number; // 0-100 overall weight
  narrativeClusterId: string;
  violatesRuleId?: string; // Subreddit rule mapping
  ruleMatchConfidence?: number; // 0.0 to 1.0 matches rule
  recommendedAction: RecommendedAction;
  status: IncidentStatus;
  userReputationScore?: number; // 0-100 indicators: account age, subreddit karma history
  brigadeProbability: number; // 0-100 calculation of outward traffic vs community regulars
  historyLog?: string[]; // Audit log of firewalls deployed
}

export interface NarrativeCluster {
  id: string;
  name: string;
  description: string;
  threatLevel: ThreatSeverity;
  detectedAt: string;
  lastActiveAt: string;
  postCount: number;
  commentCount: number;
  growthRate: number; // e.g. +45% over last hour
  associatedRuleIds: string[];
  sourcesCount: number; // Unique accounts pushing it
  sourcesEntropy: number; // Dispersion level: low entropy = highly coordinated brigade/bot swarm
  radarX: number; // Semantic layout coordinates for visualization (-100 to 100)
  radarY: number; // Semantic layout coordinates for visualization (-100 to 100)
  keySentences: string[];
  engagementDensity: number; // High replies, low upvotes (controversial ratio)
}

export interface ThreadRiskIndicator {
  sentimentTrend: "STABLE" | "DECLINING" | "PLUMMETING";
  velocitySpike: boolean; // True if posting rate > 300% median
  nonMemberParticipationRate: number; // % of commenters who are not subscribed/regulars
  crossPostCount: number; // Number of external platforms or Discord/Reddits linking to this
  userReportCount: number;
}

export interface ThreadRisk {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  createdAt: string;
  commentCount: number;
  upvoteRatio: number;
  riskScore: number; // 0-100 summary
  threatLevel: ThreatSeverity;
  narrativeVector: string; // Brief description of what narrative thread is spinning
  status: "NORMAL" | "WATCH" | "FIREWALL_ACTIVE" | "LOCKED";
  indicators: ThreadRiskIndicator;
  timelineData: { time: string; comment_velocity: number; toxicity_level: number }[];
}

export interface CoordinationNode {
  id: string;
  label: string;
  type: "USER" | "THREAD" | "EXTERNAL_LINK" | "DISCORD_SERVER" | "SUBREDDIT";
  group: number;
  weight: number;
}

export interface CoordinationLink {
  source: string;
  target: string;
  weight: number; // Strength of association
}

export interface CoordinationCluster {
  id: string;
  name: string;
  threatLevel: ThreatSeverity;
  nodesCount: number;
  detectionReason: string;
  nodes: CoordinationNode[];
  links: CoordinationLink[];
}

export interface DashboardMetrics {
  incidentsFlagged: number;
  threadsStabilized: number;
  estimatedHoursSaved: number;
  avgResponseTimeMs: number;
  firewallDeploymentCount: number;
  narrativesTracked: number;
  activeThreadsMonitored: number;
  historicalSavings: { date: string; hoursSaved: number; incidentsBlocked: number }[];
  distributionByRule: { ruleId: string; count: number }[];
}

export interface FirewallSettings {
  isEnabled: boolean;
  blockMode: "AUTOMATED" | "RECOMMENDED" | "HYBRID";
  criticalRiskThreshold: number; // e.g. 75, automatically locks or slow-modes if exceeded
  crowdControlLevel: "OFF" | "LOW" | "MEDIUM" | "HIGH";
  aiVerificationLevel: "LENIENT" | "BALANCED" | "STRICT";
  systemInstructionsPrompt: string;
  pinnedMessageTemplate: string;
}

export interface SubredditContext {
  name: string;
  subscribers: number;
  activeUsers: number;
  activeRuleIds: string[];
  firewallStatus: "ARMED" | "STANDBY" | "BYPASS";
}
