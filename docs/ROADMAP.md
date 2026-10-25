# PHANTOMNET — Three-Hour Build & Deployment Roadmap

## North star
One public URL demonstrating a complete **simulated** cyber-deception flow: realistic fake digital assets → attacker interaction → detection alert → reconstructed network path → incident timeline → exportable report.

**Deadline:** 180 minutes including deployment, testing and judge demo rehearsal.

## Phases and gates

| Phase | Time | Deliverables | Exit gate |
|---|---|---|---|
| 0. Bootstrap | 00–10 min | Inspect repo, working Vite app, dependencies, basic README | App starts and production build runs |
| 1. Visual network | 10–45 min | Polished SOC shell, six-node network, fake assets, clickable node inspector | Network and decoys visible; no broken UI |
| 2. Simulation engine | 45–85 min | Typed events, session reducer, actions, localStorage, reset, core tests | Manual interactions generate persistent events |
| 3. Detection + reconstruction | 85–120 min | Honeytoken alerts, severity, threat score, highlighted path, chronological timeline | One complete attack displays all linked evidence |
| 4. Incident report | 120–140 min | Investigation panel, exportable JSON, accessibility/layout polish | Export matches event history |
| 5. Deploy | 140–160 min | Production build + Vercel public HTTPS deployment | Actual URL opens successfully in incognito |
| 6. Validate & pitch | 160–180 min | Full demo test, responsive check, failure recovery, 90-second demo script | End-to-end public demo works twice consecutively |

> **Earlier deploy safety:** As soon as Phase 1 is stable, publish an initial Vercel preview. That protects against last-minute authentication/configuration issues; replace it with the finished production build in Phase 5.

## Phase 0 — Bootstrap
- [ ] Inspect existing files and preserve working project functionality.
- [ ] Initialize Vite/React/TypeScript only if no suitable project exists.
- [ ] Add Tailwind CSS, `@xyflow/react`, `lucide-react`; minimize extra packages.
- [ ] `npm run dev` and `npm run build` pass.
- [ ] Create/update `PHASE_STATUS.md`.

## Phase 1 — Visual foundation
- [ ] Single responsive security dashboard with sidebar, KPIs, alerts area and demo button.
- [ ] Graph: Gateway, Web, Workstation, Finance, Database, Decoy Vault.
- [ ] Edges defined in one static network seed; click node for inspection.
- [ ] Synthetic decoy files, fake credentials and monitored endpoints.
- [ ] Distinct attacker and defender perspectives; hide decoy labels from attacker view.
- [ ] Deploy early preview if Vercel access is already configured.

## Phase 2 — Real interactive simulation
- [ ] Types for assets, nodes, sessions and events.
- [ ] One append-only event flow; state validator prevents impossible movement.
- [ ] Buttons: scan, browse, open fake file, view fake credential, fake login, simulated move.
- [ ] Each action logs timestamp, actor, nodes and asset ID where relevant.
- [ ] localStorage loads/reloads cleanly; reset fully resets session.
- [ ] Tests: transitions, event creation, persistence serialization, duplicate scoring protection.

## Phase 3 — Incident detection and attack path
- [ ] File and credential honeytokens fire high/critical alerts.
- [ ] Alert panel shows severity, asset, host and specific evidence.
- [ ] Threat score derived from recorded events, max 100.
- [ ] React Flow highlights only traversed edges and visited nodes.
- [ ] Timeline events sort deterministically by timestamp and insertion order.
- [ ] `Run Demo Attack` operates through the SAME event engine as manual actions.
- [ ] Golden path: gateway → web → finance decoy → decoy credential → database attempt.

## Phase 4 — Reporting and UI finish
- [ ] Incident report displays session ID, start/end, events, path, alerts and recommendations.
- [ ] Download JSON report from current session (no invented evidence).
- [ ] Empty state when nothing suspicious happened.
- [ ] Confirm all buttons work; remove or disable anything nonfunctional.
- [ ] Optional ONLY if ahead of schedule: adaptive decoy rule, animation polish, PDF.

## Phase 5 — Production deployment
- [ ] Production build successful; errors/warnings reviewed.
- [ ] GitHub import to Vercel OR `npx vercel --prod` authenticated CLI.
- [ ] Vercel: framework Vite, build `npm run build`, output `dist`.
- [ ] Verify deployed app requests no required private API or missing environment key.
- [ ] Open the real HTTPS URL in a fresh incognito window and capture it in README.
- [ ] Don't announce deployed until verified.

## Phase 6 — Judge-ready validation
- [ ] Run complete attack manually on the public URL.
- [ ] Run one-click demo, reset, then rerun.
- [ ] Validate incident event counts/alerts/score/path consistency.
- [ ] Download JSON and inspect timestamps, IDs and evidence.
- [ ] Refresh; verify local state persistence and reset behavior.
- [ ] Open on mobile/narrow screen (critical controls accessible).
- [ ] Rehearse 90-second pitch.

## 90-second demo script
1. **0–15 sec:** Explain that ordinary security tools often alert only after broad suspicious patterns; PHANTOMNET uses decoy interactions as high-signal evidence. Clarify this is simulated.
2. **15–30 sec:** Show six-node environment and convincing fake documents, credentials and endpoints.
3. **30–50 sec:** Run attacker scenario; interact with fake payroll file and credential.
4. **50–70 sec:** Show alert, threat score, red visited-path edges and exact chronological timeline, all changing from the event stream.
5. **70–90 sec:** Open incident report, download evidence, conclude with a realistic next step: connecting to a controlled honeypot environment in future.

## Scope cuts if behind schedule
**Never cut:** real in-app event generation, fake assets, at least one decoy trigger, alert, attack path, incident timeline, Vercel deployment.

**Cut first (in order):** decorative animation → charts → adaptive decoy deployment → PDF export (retain JSON) → extra simulated hosts → multi-page navigation.

## Demo acceptance test
1. Open app as a fresh visitor and start attack session.
2. Scan and browse without an unjustified critical alert.
3. Open the decoy finance document; see an alert referencing that exact asset.
4. Use fake credentials; see a critical event and updated score.
5. Reconstruct exact visited path; inspect timeline in order.
6. Export report; confirm matching event count/IDs.
7. Reset; confirm events, path, alerts and score clear.
8. Repeat on the real Vercel production URL.

## Explicit limitations
This is a browser-side simulated environment, not a deployed honeypot or intrusion-detection system. Events remain per browser in localStorage; it does not identify real IPs, detect real users, or preserve immutable forensic logs. Blockchain and ML are not required for the stated hackathon challenge.
