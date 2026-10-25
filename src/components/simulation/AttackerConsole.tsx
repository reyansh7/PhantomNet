import React from 'react';
import {
  Terminal,
  Crosshair,
  Radio,
  FolderOpen,
  FileCode,
  KeyRound,
  ArrowRight,
  AlertOctagon,
  Flame,
} from 'lucide-react';
import { NodeId, DecoyAsset, IntrusionEvent } from '../../domain/types';
import { INITIAL_NODES, getAllowedTransitions } from '../../data/networkSeed';
import { INITIAL_DECOYS } from '../../data/decoysSeed';
import { PerformActionParams } from '../../domain/simulation';

interface AttackerConsoleProps {
  currentNodeId: NodeId;
  events: IntrusionEvent[];
  onPerformAction: (params: PerformActionParams) => boolean;
  onOpenAssetPreview: (asset: DecoyAsset) => void;
  onRunDemo: () => void;
  isScriptedRunning: boolean;
}

export const AttackerConsole: React.FC<AttackerConsoleProps> = ({
  currentNodeId,
  events,
  onPerformAction,
  onOpenAssetPreview,
  onRunDemo,
  isScriptedRunning,
}) => {
  const currentNodeDef = INITIAL_NODES.find((n) => n.id === currentNodeId);
  const hostedAssets = INITIAL_DECOYS.filter((d) => d.nodeId === currentNodeId);
  const allowedHops = getAllowedTransitions(currentNodeId);

  // Recent 6 events for the interactive terminal log
  const recentEvents = [...events].reverse().slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Attacker Context Banner */}
      <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-white text-sm">
                ACTIVE INFILTRATION CONSOLE
              </h3>
              <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-mono text-[10px] font-bold">
                ATTACKER PERSPECTIVE
              </span>
            </div>
            <p className="text-xs text-soc-textDim font-mono mt-0.5">
              Host Compromised: <span className="text-white font-semibold">{currentNodeDef?.label}</span> ({currentNodeDef?.ip})
            </p>
          </div>
        </div>

        <button
          onClick={onRunDemo}
          disabled={isScriptedRunning}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold rounded-lg shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <Flame className="w-4 h-4" />
          <span>{isScriptedRunning ? 'Executing Script...' : 'Run Automated Intrusion Chain'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Command & Recon Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tactical Action Deck */}
          <div className="bg-soc-card border border-soc-border p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-soc-textDim flex items-center gap-2">
                <Terminal className="w-4 h-4 text-soc-cyan" />
                <span>Tactical Action Deck</span>
              </h4>
              <span className="text-[11px] font-mono text-soc-textMuted">
                Zero arbitrary shell commands • Fully synthetic
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {/* Scan Current Host */}
              <button
                onClick={() =>
                  onPerformAction({
                    type: 'SCAN_HOST',
                    targetNodeId: currentNodeId,
                  })
                }
                className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-soc-border hover:border-cyan-500/50 rounded-lg text-left transition-all flex items-start gap-2.5 group"
              >
                <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-100 font-semibold group-hover:text-cyan-300">
                    Port & Service Recon
                  </div>
                  <div className="text-[10px] text-soc-textDim mt-0.5">
                    Probe listening ports on {currentNodeDef?.ip} (+5 pts, info)
                  </div>
                </div>
              </button>

              {/* Browse Directory */}
              <button
                onClick={() =>
                  onPerformAction({
                    type: 'BROWSE_DIRECTORY',
                    targetNodeId: currentNodeId,
                  })
                }
                className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-soc-border hover:border-cyan-500/50 rounded-lg text-left transition-all flex items-start gap-2.5 group"
              >
                <FolderOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-100 font-semibold group-hover:text-cyan-300">
                    Enumerate File System
                  </div>
                  <div className="text-[10px] text-soc-textDim mt-0.5">
                    List directory hierarchy & hosted files
                  </div>
                </div>
              </button>

              {/* Simulate Failed Auth */}
              <button
                onClick={() =>
                  onPerformAction({
                    type: 'LOGIN_FAILED',
                    targetNodeId: currentNodeId,
                  })
                }
                className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-soc-border hover:border-amber-500/50 rounded-lg text-left transition-all flex items-start gap-2.5 group"
              >
                <KeyRound className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-100 font-semibold group-hover:text-amber-300">
                    Test Monitored Endpoint Login
                  </div>
                  <div className="text-[10px] text-soc-textDim mt-0.5">
                    Submit brute-force credential probe (+10 pts, low)
                  </div>
                </div>
              </button>

              {/* Replay Stolen Credential */}
              <button
                onClick={() =>
                  onPerformAction({
                    type: 'FAKE_CREDENTIAL_USED',
                    targetNodeId: currentNodeId,
                    customExplanation: `Attacker replayed synthetic root token on ${currentNodeDef?.label}.`,
                  })
                }
                className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-soc-border hover:border-red-500/50 rounded-lg text-left transition-all flex items-start gap-2.5 group"
              >
                <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-100 font-semibold group-hover:text-red-300">
                    Deploy Synthetic Canary Token
                  </div>
                  <div className="text-[10px] text-soc-textDim mt-0.5">
                    Authenticate using decoy credential (+50 pts, CRITICAL)
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Lateral Movement Controls */}
          <div className="bg-soc-card border border-soc-border p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-soc-textDim flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <span>Lateral Network Pivot</span>
              </h4>
              <span className="text-[11px] font-mono text-soc-textMuted">
                Segmented graph routing enforced
              </span>
            </div>

            <p className="text-xs text-soc-textMuted">
              Adjacent reachable hosts from <span className="font-mono text-cyan-300 font-semibold">{currentNodeId}</span>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INITIAL_NODES.map((node) => {
                const isResident = node.id === currentNodeId;
                const isAdjacent = allowedHops.includes(node.id);

                return (
                  <button
                    key={node.id}
                    disabled={isResident || !isAdjacent}
                    onClick={() =>
                      onPerformAction({
                        type: 'LATERAL_MOVE_ATTEMPT',
                        targetNodeId: node.id,
                      })
                    }
                    className={`p-2.5 rounded-lg border text-left transition-all font-mono text-xs ${
                      isResident
                        ? 'bg-slate-900/40 border-soc-border text-soc-textDim cursor-not-allowed'
                        : isAdjacent
                        ? 'bg-purple-950/30 hover:bg-purple-900/50 border-purple-500/40 text-purple-200 hover:scale-[1.02]'
                        : 'bg-slate-900/20 border-soc-border/40 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold text-slate-100 flex items-center justify-between">
                      <span className="truncate">{node.label}</span>
                      {isResident && <span className="text-[9px] text-red-400">HERE</span>}
                    </div>
                    <div className="text-[10px] text-soc-textDim mt-0.5">
                      {node.ip}
                    </div>
                    <div className="text-[9px] mt-1">
                      {isResident ? (
                        <span className="text-soc-textDim">Current Resident</span>
                      ) : isAdjacent ? (
                        <span className="text-purple-400 font-bold">➔ Pivot (+25 pts)</span>
                      ) : (
                        <span className="text-slate-600">Blocked (VLAN)</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discovered Files & Credentials on Current Node */}
          <div className="bg-soc-card border border-soc-border p-4 rounded-xl space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-soc-textDim flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Discovered High-Value Assets on {currentNodeDef?.label}</span>
            </h4>

            {hostedAssets.length === 0 ? (
              <p className="text-xs text-soc-textDim italic">
                No high-value assets identified in this directory path.
              </p>
            ) : (
              <div className="space-y-2">
                {hostedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 bg-slate-900/90 border border-soc-border rounded-lg flex items-center justify-between gap-3 group hover:border-soc-borderLight transition-all"
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                          {asset.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono capitalize">
                          {asset.kind}
                        </span>
                      </div>
                      <p className="text-[11px] text-soc-textDim mt-0.5 truncate">
                        {asset.metadata?.classification || 'Standard Asset'} • {asset.metadata?.fileSize || 'Live Service'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenAssetPreview(asset)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => {
                          if (asset.kind === 'file') {
                            onPerformAction({
                              type: 'SENSITIVE_FILE_OPENED',
                              targetNodeId: currentNodeId,
                              assetId: asset.id,
                            });
                          } else if (asset.kind === 'credential') {
                            onPerformAction({
                              type: 'HONEYTOKEN_VIEWED',
                              targetNodeId: currentNodeId,
                              assetId: asset.id,
                            });
                          } else {
                            onPerformAction({
                              type: 'LOGIN_FAILED',
                              targetNodeId: currentNodeId,
                              assetId: asset.id,
                            });
                          }
                        }}
                        className="px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded font-mono text-xs font-bold transition-all shadow-sm"
                      >
                        Exfiltrate Asset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Attacker Shell Log */}
        <div className="bg-slate-950 border border-soc-border rounded-xl p-4 flex flex-col font-mono text-xs h-[500px]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-300 font-bold">RECON_SHELL.log</span>
            </div>
            <span className="text-[10px] text-slate-500">LIVE FEED</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-[11px]">
            <div className="text-slate-500">
              # Connected to synthetic session runtime.
              <br />
              # Actions emit deterministic telemetry events.
            </div>

            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900/80 border border-slate-800 p-2.5 rounded text-slate-300 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-cyan-400 font-semibold">{evt.type}</span>
                  <span className="text-slate-500">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-200">{evt.explanation}</p>
                {evt.scoreDelta > 0 && (
                  <span className="inline-block text-[10px] text-amber-400 font-bold">
                    Detection Score Delta: +{evt.scoreDelta}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-cyan-400 flex items-center gap-1">
            <span>attacker@{currentNodeId}:~$</span>
            <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
};
