import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Server,
  Shield,
  ShieldAlert,
  Database,
  Laptop,
  Flame,
  Radio,
  Lock,
} from 'lucide-react';
import { NodeId, NodeStatus } from '../../domain/types';
import { Perspective } from '../../hooks/useSimulationStore';

export interface CustomNodeData {
  [key: string]: unknown;
  id: NodeId;
  label: string;
  ip: string;
  role: string;
  isDecoy: boolean;
  status: NodeStatus;
  isCurrentAttackerNode: boolean;
  isVisited: boolean;
  perspective: Perspective;
  decoyAssetsCount: number;
  isSelected: boolean;
}

const nodeIcons: Record<NodeId, React.FC<{ className?: string }>> = {
  gateway: Radio,
  web: Server,
  workstation: Laptop,
  finance: Shield,
  database: Database,
  'decoy-vault': Lock,
};

export const CustomNetworkNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const IconComponent = nodeIcons[data.id] || Server;

  // Determine border and accent styling based on status
  let statusBorder = 'border-soc-border hover:border-soc-borderLight';
  let statusGlow = '';
  let statusBg = 'bg-soc-card/95';

  if (data.status === 'triggered') {
    statusBorder = 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.35)]';
    statusGlow = 'ring-2 ring-red-500/50';
    statusBg = 'bg-red-950/30';
  } else if (data.status === 'suspicious') {
    statusBorder = 'border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    statusGlow = 'ring-1 ring-amber-500/40';
    statusBg = 'bg-amber-950/20';
  } else if (data.isVisited) {
    statusBorder = 'border-soc-cyan/60';
  }

  if (data.isSelected) {
    statusGlow += ' ring-2 ring-cyan-400';
  }

  return (
    <div
      className={`relative px-3 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 w-52 select-none cursor-pointer ${statusBorder} ${statusGlow} ${statusBg}`}
    >
      {/* React Flow Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-cyan-500 !border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-cyan-500 !border-slate-900" />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-cyan-500 !border-slate-900" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-cyan-500 !border-slate-900" />

      {/* Attacker Infiltration Beacon */}
      {data.isCurrentAttackerNode && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse whitespace-nowrap">
          <Flame className="w-2.5 h-2.5" />
          <span>ATTACKER HERE</span>
        </div>
      )}

      {/* Header: Icon + Name + Status Indicator */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              data.status === 'triggered'
                ? 'bg-red-500/20 text-red-400'
                : data.status === 'suspicious'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-cyan-500/10 text-soc-cyan'
            }`}
          >
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100 font-sans tracking-wide leading-tight">
              {data.label}
            </h4>
            <span className="font-mono text-[10px] text-soc-textDim">
              {data.ip}
            </span>
          </div>
        </div>

        {/* Status Dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            data.status === 'triggered'
              ? 'bg-red-500 animate-ping'
              : data.status === 'suspicious'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          title={`Status: ${data.status}`}
        />
      </div>

      {/* Node Role & Decoy Badges */}
      <div className="mt-2 pt-2 border-t border-soc-border/60 flex items-center justify-between text-[10px]">
        <span className="text-soc-textMuted font-mono truncate max-w-[110px]">
          {data.role}
        </span>

        {/* In Defender view: Show Decoy badge if it's a decoy honeypot */}
        {data.perspective === 'defender' && data.isDecoy && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[9px] flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" />
            HONEYPOT
          </span>
        )}

        {/* If in attacker perspective: Disguise decoys as normal hosts */}
        {data.perspective === 'attacker' && data.isDecoy && (
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px]">
            HOST-ONLINE
          </span>
        )}
      </div>

      {/* Traversed indicator */}
      {data.isVisited && (
        <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-soc-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-soc-cyan" />
          <span>Traversed in path</span>
        </div>
      )}
    </div>
  );
};
