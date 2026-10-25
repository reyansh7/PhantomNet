# PHANTOMNET — Cyber Deception & Intrusion Reconstruction

> **ORCA CODER Hackathon — Track 03: Cybersecurity & Blockchain**  
> *"Develop a cyber deception system that creates realistic decoy digital assets to detect intruders and trace their movement through a simulated network."*

---

## 🛡️ Project Overview

**PHANTOMNET** is a high-signal cyber-deception prototype engineered to solve a fundamental security challenge: standard perimeter controls suffer from high false-positive rates and delayed detection. PHANTOMNET deploys high-interaction synthetic decoy digital assets—fake files, synthetic credentials, and monitored fake API endpoints—across a simulated enterprise topology.

When an intruder touches any decoy asset, the event is immediately captured by an immutable, deterministic event engine. PHANTOMNET:
1. **Generates high-signal alerts** with exact asset evidence and zero guesswork.
2. **Reconstructs the attacker's trajectory** in real time across the network graph.
3. **Chronologically sequences the incident** into a granular investigation timeline.
4. **Calculates a deterministic threat score** reflecting cumulative intrusion risk.
5. **Exports comprehensive incident response reports** in JSON for SOC teams.

*Note: In accordance with hackathon guidelines, blockchain is a track category name, not a requirement; this prototype focuses strictly on high-signal cyber deception and intrusion reconstruction.*

---

## ⚡ Quick Start

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.18.0`)
- `npm`

### Local Development
```bash
# Clone and enter directory
cd orcathon

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build & Test
```bash
# Run unit tests
npm run test

# Compile production bundle
npm run build
```

---

## 🎯 90-Second Judge Demonstration Script

1. **00–15s (Problem & Deception Paradigm):**  
   Introduce PHANTOMNET: Traditional detection relies on noisy anomaly heuristics. PHANTOMNET flips the asymmetric advantage to defenders by deploying high-fidelity decoy assets that legitimate users never touch. Clarify that this is an interactive simulation.
2. **15–30s (Environment & Decoys):**  
   Highlight the 6-node network: Gateway (`192.0.2.10`), Web Server (`192.0.2.20`), Workstation (`192.0.2.30`), Finance Server (`192.0.2.40`), Database (`192.0.2.50`), and Decoy Vault (`192.0.2.60`). Show how defender view reveals decoy badges while attacker view presents convincing decoy files (`payroll_Q3_2026.xlsx`), credentials (`DEMO_ONLY_NOT_VALID`), and endpoints (`/backup`).
3. **30–50s (Interactive Attack):**  
   Click **"Run Demo Attack"** (or use step-by-step attacker controls): Attacker scans Gateway, browses Web Server, pivots to Finance Server, opens the decoy payroll document, views the synthetic admin token, and attempts a lateral pivot to the Database.
4. **50–70s (Unified Detection & Path Reconstruction):**  
   Show the live response: Threat score surges to **100/100**, high-severity and critical alerts trigger with specific honeytoken IDs, and the network graph animates the exact traversed path in crimson edges. Point out the chronological timeline derived from the single event store.
5. **70–90s (Incident Report & Export):**  
   Navigate to the **Incidents** tab, inspect the automatically generated forensic incident report, demonstrate the **Export JSON Report** button, and demonstrate the **Reset Demo** capability.

---

## 🏗️ Architecture & Technical Stack

- **Frontend Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS with custom SOC dark navy/charcoal palette
- **Network Topology:** `@xyflow/react` (React Flow) with customized nodes and reactive edge states
- **Iconography:** `lucide-react`
- **Testing:** Vitest for deterministic unit testing of state transitions and detection rules
- **State Management:** Append-only immutable event reducer backed by `localStorage` persistence

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) and [`docs/ROADMAP.md`](./docs/ROADMAP.md) for full technical specifications.

---

## 🔒 Security & Limitations Notice

- **Honest Scope:** All hosts, endpoints, tokens, credentials, and attacks are inert simulations.
- **Reserved IP Range:** All documentation IP addresses utilize RFC 5737 TEST-NET blocks (`192.0.2.0/24`, `198.51.100.0/24`).
- **Client-Side Simulation:** Events are persisted per browser session in `localStorage`. No real network traffic, packet inspection, external scanning, or offensive commands are ever generated or captured.
