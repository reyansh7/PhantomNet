import React from 'react';
import {
  Shield,
  ShieldAlert,
  FileText,
  Key,
  Globe,
  Radio,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  X,
} from 'lucide-react';
import { NodeId, NodeStatus, DecoyAsset } from '../../domain/types';
import { INITIAL_NODES, getAllowedTransitions } from '../../data/networkSeed';
import { INITIAL_DECOYS } from '../../data/decoysSeed';
import { Perspective } from '../../hooks/useSimulationStore';

interface NodeDetailsPanelProps {
  selectedNodeId: NodeId;
  currentNodeId: NodeId;
  nodeStatuses: Record<NodeId, NodeStatus>;
  perspective: Perspective;
  onClose?: () => void;
  onOpenAssetPreview: (asset: DecoyAsset) => void;
  onPerformAction: (params: any) => void;
}

export const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  selectedNodeId,
  currentNodeId,
  nodeStatuses,
  perspective,
  onClose,
  onOpenAssetPreview,
  onPerformAction,
}) => {
  const nodeDef = INITIAL_NODES.find((n) => n.id === selectedNodeId);
  if (!nodeDef) return null;

  const status = nodeStatuses[selectedNodeId];
  const isCurrentResident = currentNodeId === selectedNodeId;
  const hostedDecoys = INITIAL_DECOYS.filter((d) => d.nodeId === selectedNodeId);
  const allowedHopsFromCurrent = getAllowedTransitions(currentNodeId);
  const canMoveHere = !isCurrentResident && allowedHopsFromCurrent.includes(selectedNodeId);

  return (
    <div className="bg-soc-card border border-soc-border rounded-xl p-4 flex flex-col gap-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-soc-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-base font-sans">
              {nodeDef.label}
            </h3>
            {isCurrentResident && (
              <span className="px-2 py-0.5 rounded bg-red-600/80 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" />
                ATTACKER RESIDENT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-soc-cyan">{nodeDef.ip}</span>
            <span className="text-soc-textDim text-xs">•</span>
            <span className="text-xs text-soc-textMuted">{nodeDef.role}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-soc-textDim hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status & Integrity Banner */}
      <div
        className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
          status === 'triggered'
            ? 'bg-red-950/40 border-red-500/40 text-red-200'
            : status === 'suspicious'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : 'bg-slate-900/50 border-soc-border text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {status === 'triggered' ? (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          ) : status === 'suspicious' ? (
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div>
            <span className="font-mono font-bold uppercase tracking-wide">
              {status === 'triggered'
                ? 'TRIPWIRE BREACHED'
                : status === 'suspicious'
                ? 'SUSPICIOUS TELEMETRY'
                : 'BASELINE SECURE'}
            </span>
            <p className="text-[11px] text-soc-textMuted">
              {status === 'triggered'
                ? 'Honeytoken canary accessed or fake credential replayed.'
                : status === 'suspicious'
                ? 'Reconnaissance or failed authentication logged.'
                : 'No unverified telemetry detected on this interface.'}
            </p>
          </div>
        </div>
      </div>

      {/* Machine Specifications */}
      <div className="space-y-2 text-xs">
        <h4 className="font-mono text-[11px] uppercase tracking-wider text-soc-textDim">
          System Specifications
        </h4>
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-soc-border space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-soc-textDim">OS Environment:</span>
            <span className="text-slate-200">{nodeDef.os}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-soc-textDim">Listening Services:</span>
            <span className="text-cyan-300">{nodeDef.services.join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-soc-textDim">Node Classification:</span>
            <span className="text-slate-200">
              {perspective === 'defender' && nodeDef.isDecoy
                ? 'High-Interaction Decoy Honeypot'
                : 'Standard Enterprise Node'}
            </span>
          </div>
        </div>
      </div>

      {/* Hosted Decoy Assets on this Node */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-soc-textDim">
            Hosted Digital Assets ({hostedDecoys.length})
          </h4>
          {perspective === 'defender' && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              DEFENDER VIEW: CANARIES ARMED
            </span>
          )}
        </div>

        {hostedDecoys.length === 0 ? (
          <p className="text-xs text-soc-textDim italic bg-slate-900/40 p-3 rounded-lg border border-soc-border">
            No active decoy assets bound to this node.
          </p>
        ) : (
          <div className="space-y-1.5">
            {hostedDecoys.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-900/80 border border-soc-border hover:border-cyan-500/50 p-2.5 rounded-lg flex items-center justify-between gap-2 group transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                    {asset.kind === 'file' ? (
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    ) : asset.kind === 'credential' ? (
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-mono font-medium text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {asset.label}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-soc-textDim font-mono">
                      <span className="capitalize">{asset.kind}</span>
                      {perspective === 'defender' && (
                        <span className="text-emerald-400 font-bold">
                          {asset.honeytokenId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenAssetPreview(asset)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-soc-textMuted hover:text-white transition-colors text-[11px] flex items-center gap-1 font-mono"
                    title="View asset content and canary preview"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Inspect</span>
                  </button>

                  {/* Attacker Interaction Shortcut */}
                  {isCurrentResident && (
                    <button
                      onClick={() => {
                        if (asset.kind === 'file') {
                          onPerformAction({
                            type: 'SENSITIVE_FILE_OPENED',
                            targetNodeId: selectedNodeId,
                            assetId: asset.id,
                          });
                        } else if (asset.kind === 'credential') {
                          onPerformAction({
                            type: 'HONEYTOKEN_VIEWED',
                            targetNodeId: selectedNodeId,
                            assetId: asset.id,
                          });
                        } else {
                          onPerformAction({
                            type: 'LOGIN_FAILED',
                            targetNodeId: selectedNodeId,
                            assetId: asset.id,
                          });
                        }
                      }}
                      className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-[10px] font-mono transition-colors"
                      title="Trigger simulated attacker touch on this asset"
                    >
                      Touch Canary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contextual Actions */}
      <div className="mt-auto pt-3 border-t border-soc-border space-y-2">
        <h4 className="font-mono text-[11px] uppercase tracking-wider text-soc-textDim">
          Simulation Actions
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            onClick={() =>
              onPerformAction({
                type: 'SCAN_HOST',
                targetNodeId: selectedNodeId,
              })
            }
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-soc-border flex items-center justify-center gap-1.5 transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Port Scan</span>
          </button>

          {canMoveHere ? (
            <button
              onClick={() =>
                onPerformAction({
                  type: 'LATERAL_MOVE_ATTEMPT',
                  targetNodeId: selectedNodeId,
                })
              }
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors font-bold"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Pivot Here</span>
            </button>
          ) : (
            <button
              disabled
              className="px-3 py-1.5 bg-slate-900 text-soc-textDim rounded-lg border border-soc-border/40 cursor-not-allowed flex items-center justify-center gap-1.5"
              title={
                isCurrentResident
                  ? 'Attacker already resident here'
                  : 'Host not adjacent in network topology'
              }
            >
              <span>{isCurrentResident ? 'Resident' : 'Segmented'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
