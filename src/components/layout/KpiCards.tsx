import React from 'react';
import {
  Target,
  Server,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { NodeId, NodeStatus } from '../../domain/types';

interface KpiCardsProps {
  threatScore: number;
  threatLevel: { level: string; color: string; badgeClass: string };
  currentNodeId: NodeId;
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  nodeStatuses: Record<NodeId, NodeStatus>;
  visitedNodesCount: number;
  eventsCount: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  threatScore,
  threatLevel,
  currentNodeId,
  totalAlerts,
  criticalAlerts,
  highAlerts,
  nodeStatuses,
  visitedNodesCount,
  eventsCount,
}) => {
  const triggeredNodesCount = Object.values(nodeStatuses).filter(
    (s) => s === 'triggered'
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Threat Score KPI */}
      <div className="bg-soc-card border border-soc-border p-3.5 rounded-xl relative overflow-hidden group hover:border-soc-borderLight transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono uppercase text-soc-textDim tracking-wider">
            Risk Score
          </span>
          <Flame
            className="w-4 h-4 transition-transform group-hover:scale-110"
            style={{ color: threatLevel.color }}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {threatScore}
          </span>
          <span className="text-xs text-soc-textDim font-mono">/100</span>
          <span
            className={`text-[10px] ml-auto font-mono px-2 py-0.5 rounded border font-semibold ${threatLevel.badgeClass}`}
          >
            {threatLevel.level}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${threatScore}%`, backgroundColor: threatLevel.color }}
          />
        </div>
      </div>

      {/* 2. Decoy Integrity KPI */}
      <div className="bg-soc-card border border-soc-border p-3.5 rounded-xl group hover:border-soc-borderLight transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono uppercase text-soc-textDim tracking-wider">
            Canary Status
          </span>
          <Target className="w-4 h-4 text-soc-cyan transition-transform group-hover:scale-110" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {triggeredNodesCount}
          </span>
          <span className="text-xs text-soc-textDim font-mono">/ 6 hosts breached</span>
        </div>
        <p className="text-[11px] text-soc-textMuted mt-1">
          {triggeredNodesCount > 0 ? (
            <span className="text-red-400 font-medium">Tripwire honeytokens touched</span>
          ) : (
            <span className="text-emerald-400 font-medium">All decoy tripwires intact</span>
          )}
        </p>
      </div>

      {/* 3. High-Signal Alerts KPI */}
      <div className="bg-soc-card border border-soc-border p-3.5 rounded-xl group hover:border-soc-borderLight transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono uppercase text-soc-textDim tracking-wider">
            Active Alerts
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-400 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">
            {totalAlerts}
          </span>
          <span className="text-xs text-soc-textDim font-mono">triggers</span>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono">
            {criticalAlerts > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 font-bold">
                {criticalAlerts} CRIT
              </span>
            )}
            {highAlerts > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold">
                {highAlerts} HIGH
              </span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-soc-textMuted mt-1">
          {criticalAlerts > 0 ? 'P1 Incident declared' : totalAlerts > 0 ? 'Suspicious probes' : 'Passive baseline'}
        </p>
      </div>

      {/* 4. Intrusion Presence KPI */}
      <div className="bg-soc-card border border-soc-border p-3.5 rounded-xl group hover:border-soc-borderLight transition-all">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono uppercase text-soc-textDim tracking-wider">
            Attacker Presence
          </span>
          <Server className="w-4 h-4 text-purple-400 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold font-mono text-white capitalize truncate">
            {currentNodeId}
          </span>
          <span className="text-xs text-soc-textDim font-mono ml-auto">
            {visitedNodesCount} hops
          </span>
        </div>
        <p className="text-[11px] text-soc-textMuted mt-1">
          <span className="text-purple-300 font-mono">{eventsCount} total telemetry events</span>
        </p>
      </div>
    </div>
  );
};
