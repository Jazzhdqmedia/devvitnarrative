# Narrative Firewall

> A narrative-aware social firewall for Reddit communities built with Devvit.

Narrative Firewall is a Devvit-native moderation intelligence system that helps moderators detect harmful narratives before they become full moderation crises. Instead of treating abuse as isolated comments, it identifies emerging patterns across posts and threads, scores escalation risk, surfaces suspicious coordination signals, and recommends the lightest effective intervention to protect community health.

Built for the **Reddit Mod Tools and Migrated Apps Hackathon**, Narrative Firewall is designed to reduce moderator load, improve response speed, and give subreddit teams a clearer operational view of fast-moving discussions.

---

## Table of Contents

- [Why Narrative Firewall](#why-narrative-firewall)
- [What It Does](#what-it-does)
- [Core Features](#core-features)
- [Product Surfaces](#product-surfaces)
- [Core Loop](#core-loop)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Demo Scenarios](#demo-scenarios)
- [Roadmap](#roadmap)
- [Why It Matters](#why-it-matters)
- [License](#license)

---

## Why Narrative Firewall

Most moderation tools react to individual pieces of content after damage has already started. But real subreddit instability often emerges at the narrative level: repeated framing, coordinated talking points, semantic dog whistles, suspicious influxes of new participants, and fast-moving pile-ons that only become obvious when moderators are already overloaded.

Narrative Firewall addresses that gap by turning scattered comments, thread behavior, and coordination signals into incident-level intelligence that moderators can understand and act on quickly.

---

## What It Does

Narrative Firewall combines two systems into one moderation workflow:

- **Narrative Intelligence Engine**  
  Detects harmful or destabilizing storylines forming across posts and comments, such as outrage cascades, rumor amplification, harassment escalation, coordinated grievance framing, or brigading-like semantic repetition.

- **Social Firewall**  
  Converts those signals into practical, lightweight moderation responses such as monitoring, slow mode, review gating, suspicious-participant filtering, or escalation to human moderators.

The goal is not to replace moderators with opaque automation. The goal is to give them earlier visibility, clearer explanations, and smarter intervention options so they can act before a thread collapses, a pile-on accelerates, or a raid overwhelms the queue.

---

## Core Features

- Detect emerging narrative clusters across posts and comments
- Score thread-level and incident-level escalation risk
- Identify suspicious coordination and brigading-like activity patterns
- Map incidents to subreddit rules and moderation policy context
- Recommend the lightest effective intervention with human-readable explanations
- Track outcomes and surface moderator impact metrics such as incidents flagged, threads stabilized, and estimated time saved

---

## Product Surfaces

### Overview Dashboard
A high-level command view of active incidents, high-risk threads, coordination alerts, recommended actions, and community health indicators.

### Incident Console
The core moderator workspace for scanning active incidents, reviewing risk, understanding why something was flagged, and choosing the next action.

### Narrative Radar
A live view of emerging narratives, showing what storyline is forming, where it is spreading, how fast it is growing, and why it matters.

### Thread Risk
A ranked view of threads most likely to destabilize, with explainable risk breakdowns and intervention suggestions.

### Coordination
An intelligence view for suspicious surges, semantic repetition, synchronized participation, new-account concentration, and other manipulation signals.

### Policy Mapping
A rule-aware explanation layer that connects incidents and narratives to subreddit-specific moderation policies.

### Metrics
A measurement layer for moderator value and community impact, including intervention results, thread stabilization, and estimated time savings.

### Settings
Configuration tools for thresholds, automation preferences, notification rules, module toggles, and moderation workflow controls.

---

## Core Loop

1. **Observe** — Ingest posts, comments, reports, mod actions, and behavioral signals.
2. **Interpret** — Group content into narrative clusters and identify social threat patterns.
3. **Score** — Compute escalation risk and confidence using narrative, behavioral, and coordination signals.
4. **Intervene** — Recommend or apply the lightest effective moderation action.
5. **Learn** — Measure whether the intervention stabilized the thread or reduced moderator burden.

---

## Architecture

Narrative Firewall is designed as a modular moderation intelligence system.

### Conceptual layers

- **Signal Ingestion Layer**  
  Collects post, comment, report, and moderation event signals.

- **Narrative Analysis Layer**  
  Groups related content into narrative clusters and identifies threat patterns.

- **Risk Scoring Layer**  
  Scores incidents and threads using narrative, behavioral, and coordination signals.

- **Policy Mapping Layer**  
  Connects detected issues to subreddit rules and moderation context.

- **Intervention Layer**  
  Recommends the lightest effective response for moderators.

- **Moderator UX Layer**  
  Presents incidents, explanations, action recommendations, and impact metrics through a clear operational interface.

---

## Tech Stack

- **Platform:** Reddit Devvit
- **Language:** TypeScript
- **Architecture:** Modular UI + domain-driven mock data layer
- **Initial data mode:** Local mock data for simulation and demo flows
- **Design style:** Trust-and-safety intelligence console / security operations inspired UI

---

## Getting Started

> Update these commands based on your actual setup once the implementation is finalized.

### Prerequisites

- Node.js
- npm or pnpm
- Reddit Devvit CLI / local Devvit setup
- A Reddit developer environment configured for Devvit apps

### Install

```bash
git clone https://github.com/your-username/narrative-firewall.git
cd narrative-firewall
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```bash
narrative-firewall/
├── src/
│   ├── app/
│   │   ├── screens/
│   │   ├── layout/
│   │   └── components/
│   ├── domain/
│   │   ├── types/
│   │   ├── models/
│   │   └── scoring/
│   ├── mocks/
│   │   ├── incidents/
│   │   ├── narratives/
│   │   ├── coordination/
│   │   └── metrics/
│   ├── services/
│   ├── utils/
│   └── index.ts
├── assets/
├── README.md
├── package.json
└── tsconfig.json
```

---

## Demo Scenarios

The app is designed to showcase multiple moderation situations, such as:

1. **Brigading-like controversy surge** in a large subreddit
2. **Harassment escalation cluster** in a support or advice subreddit
3. **Rumor and outrage amplification** in a gaming or fandom subreddit

These scenarios help demonstrate how narrative clustering, coordination detection, and lightweight intervention recommendations work together.

---

## Roadmap

- Real-time Reddit signal ingestion
- Better incident scoring and confidence calibration
- Moderator feedback loop for improving recommendations
- Rule customization per subreddit
- Historical narrative trend analysis
- Better intervention outcome tracking
- Multi-subreddit intelligence views for mod teams
- Admin-grade audit logs and moderation simulation tools

---

## Why It Matters

Narrative Firewall treats moderation as a social systems problem, not just a content-filtering problem. By combining narrative intelligence with adaptive social defense, it creates a new moderation layer for Reddit: one that helps communities identify instability earlier, intervene more intelligently, and stay resilient under pressure.

This makes it especially relevant for communities where moderation burden is driven less by obvious spam and more by fast-moving narrative manipulation, harassment waves, and coordination patterns that overwhelm queues before any single comment looks catastrophic on its own.

---

## License

This project is currently being developed for the Reddit Mod Tools and Migrated Apps Hackathon.

Add your preferred license here, for example:

```text
MIT License
```

Or include a full `LICENSE` file in the repository root.
