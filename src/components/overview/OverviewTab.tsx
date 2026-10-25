import React from 'react';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Server,
  ArrowRight,
  Flame,
  CheckCircle2,
  FileText,
  Key,
  Globe,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import {
  Alert,
  DecoyAsset,
  IncidentReport,
  NodeId,
  NodeStatus,
} from '../../domain/types';
import { INITIAL_DECOYS } from '../../data/decoysSeed';
import { INITIAL_NODES } from '../../data/networkSeed';
import { ActiveTab, Perspective } from '../../hooks/useSimulationStore';

interface OverviewTabProps {
  currentNodeId: NodeId;
  alerts: Alert[];
  nodeStatuses: Record<NodeId, NodeStatus>;
  attackTrajectory: NodeId[];
  report: IncidentReport;
  perspective: Perspective;
  onRunDemo: () => void;
  onResetDemo: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAssetPreview: (asset: DecoyAsset) => void;
  isScriptedRunning: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  currentNodeId,
  alerts,
  nodeStatuses,
  attackTrajectory,
  report,
  perspective,
  onRunDemo,
  onResetDemo,
  setActiveTab,
  onOpenAssetPreview,
  isScriptedRunning,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner: Problem Statement & Fast Demo CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-soc-card to-slate-950 border border-soc-border p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ORCA CODER Track 03: Cyber Deception & Asset Tracking
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              High-Signal Cyber Deception & Reconstructed Intrusion Path
            </h1>
            <p className="text-sm text-soc-textMuted leading-relaxed">
              Detect adversaries with zero guesswork. When synthetic decoy documents, fake credentials,
              or monitored endpoints are interacted with, PHANTOMNET immediately isolates the event,
              reconstructs the complete trajectory across the enterprise network, and compiles forensic incident dossiers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <button
              onClick={onRunDemo}
              disabled={isScriptedRunning}
              className="px-5 py-3 rounded-xl bg-soc-cyan hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isScriptedRunning ? 'Replaying Demo...' : 'Run Demo Attack (Golden Flow)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className="px-4 py-3 rounded-xl border border-soc-border bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-mono text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Crosshair className="w-4 h-4 text-soc-cyan" />
              <span>Inspect Network</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Trajectory Strip + Recent Alerts + Active Decoys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Attack Trajectory & Topology Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attack Trajectory Card */}
          <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono font-bold text-white text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Traversed Attacker Trajectory</span>
                </h3>
                <p className="text-xs text-soc-textDim">
                  Reconstructed movement path derived deterministically from session events.
                </p>
              </div>

              <span className="font-mono text-xs text-soc-cyan font-bold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                Current: {currentNodeId}
              </span>
            </div>

            {/* Stepper Trail */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-soc-border overflow-x-auto">
              <div className="flex items-center gap-2 font-mono text-xs min-w-max">
                {attackTrajectory.map((nodeId, idx) => {
                  const nodeDef = INITIAL_NODES.find((n) => n.id === nodeId);
                  const isCurrent = nodeId === currentNodeId;
                  const isTriggered = nodeStatuses[nodeId] === 'triggered';

                  return (
                    <React.Fragment key={idx}>
                      <div
                        className={`px-3 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                          isTriggered
                            ? 'bg-red-950/40 border-red-500/50 text-red-200'
                            : isCurrent
                            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 ring-1 ring-amber-500/30'
                            : 'bg-slate-900 border-soc-border text-slate-300'
                        }`}
                      >
                        <Server className="w-3.5 h-3.5 text-soc-cyan" />
                        <div>
                          <div className="font-bold">{nodeDef?.label || nodeId}</div>
                          <div className="text-[10px] text-soc-textDim">{nodeDef?.ip}</div>
                        </div>
                        {isTriggered && (
                          <span className="text-[9px] px-1 bg-red-900 text-red-200 rounded font-bold">
                            ALERT
                          </span>
                        )}
                      </div>

                      {idx < attackTrajectory.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-soc-textDim font-mono">
                {attackTrajectory.length} hops recorded across simulated enterprise perimeter.
              </span>
              <button
                onClick={() => setActiveTab('network')}
                className="text-soc-cyan hover:underline font-mono text-xs flex items-center gap-1"
              >
                <span>View Full Topology Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Decoys Catalog */}
          <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono font-bold text-white text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Seeded Synthetic Decoy Assets ({INITIAL_DECOYS.length})</span>
                </h3>
                <p className="text-xs text-soc-textDim">
                  Harmless synthetic traps configured with instant canary beacons.
                </p>
              </div>

              {perspective === 'defender' && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  CANARIES VISIBLE
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {INITIAL_DECOYS.slice(0, 6).map((decoy) => {
                const host = INITIAL_NODES.find((n) => n.id === decoy.nodeId);

                return (
                  <div
                    key={decoy.id}
                    onClick={() => onOpenAssetPreview(decoy)}
                    className="p-3 bg-slate-900/80 border border-soc-border hover:border-soc-cyan/60 rounded-lg cursor-pointer transition-all group flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        {decoy.kind === 'file' ? (
                          <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : decoy.kind === 'credential' ? (
                          <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        )}
                        <span className="font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                          {decoy.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-soc-textDim">
                        Host: {host?.label} ({host?.ip})
                      </div>
                      {perspective === 'defender' && (
                        <div className="text-[10px] text-emerald-400 font-bold">
                          Canary: {decoy.honeytokenId}
                        </div>
                      )}
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-soc-textDim group-hover:text-white shrink-0 mt-0.5" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: High-Signal Alert Stream & Quick Launch */}
        <div className="space-y-6">
          <div className="bg-soc-card border border-soc-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-soc-cyan" />
                <span>Detection Stream</span>
              </h3>
              <button
                onClick={() => setActiveTab('incidents')}
                className="text-[11px] font-mono text-soc-cyan hover:underline"
              >
                All Incidents ➔
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="py-8 text-center text-soc-textDim space-y-2">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-500/40" />
                <p className="text-xs font-mono">No intrusion alerts recorded.</p>
                <p className="text-[11px]">System operating at nominal security baseline.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 font-mono transition-all ${
                      alert.severity === 'critical'
                        ? 'bg-red-950/30 border-red-500/40'
                        : alert.severity === 'high'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-900 border-soc-border'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`font-bold uppercase ${
                          alert.severity === 'critical'
                            ? 'text-red-300'
                            : alert.severity === 'high'
                            ? 'text-amber-300'
                            : 'text-cyan-300'
                        }`}
                      >
                        [{alert.severity}]
                      </span>
                      <span className="text-soc-textDim">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 truncate">
                      {alert.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Target: {alert.nodeId}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Simulation Reset / Status Card */}
          <div className="bg-slate-950 border border-soc-border rounded-xl p-5 space-y-3 font-mono text-xs">
            <h4 className="text-soc-textDim uppercase tracking-wider text-[11px]">
              Session Controls
            </h4>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-soc-textDim">Active Session ID:</span>
                <span className="text-cyan-300 font-bold">{report.sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soc-textDim">Total Events:</span>
                <span>{report.totalEvents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soc-textDim">Threat Classification:</span>
                <span className="text-amber-400 truncate max-w-[150px]">
                  {report.classification}
                </span>
              </div>
            </div>

            <button
              onClick={onResetDemo}
              className="w-full mt-3 py-2 rounded-lg border border-soc-border bg-slate-900 hover:bg-slate-800 text-soc-textMuted hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulation State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
