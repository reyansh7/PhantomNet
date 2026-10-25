import React from 'react';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Eye,
  Crosshair,
  FileDown,
  Terminal,
  Activity,
} from 'lucide-react';
import { ActiveTab, Perspective } from '../../hooks/useSimulationStore';
import { NodeId } from '../../domain/types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  perspective: Perspective;
  setPerspective: (p: Perspective) => void;
  threatScore: number;
  threatLevel: { level: string; color: string; badgeClass: string };
  currentNodeId: NodeId;
  isScriptedRunning: boolean;
  scriptedStep: number;
  onRunDemo: () => void;
  onResetDemo: () => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  perspective,
  setPerspective,
  threatScore,
  threatLevel,
  currentNodeId,
  isScriptedRunning,
  scriptedStep,
  onRunDemo,
  onResetDemo,
  onExportReport,
}) => {
  return (
    <header className="bg-soc-card/90 backdrop-blur-md border-b border-soc-border sticky top-0 z-40 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Simulation Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-soc-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldAlert className="w-6 h-6 text-soc-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-lg text-white">
                PHANTOM<span className="text-soc-cyan">NET</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                Simulated Deception Engine
              </span>
            </div>
            <p className="text-xs text-soc-textDim hidden sm:block">
              Decoy Asset Honeypots & Automated Intrusion Path Reconstruction
            </p>
          </div>
        </div>

        {/* Global Action CTAs & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Threat Gauge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-soc-border">
            <Activity className="w-4 h-4 text-soc-textMuted animate-pulse" />
            <span className="text-xs text-soc-textMuted font-mono">THREAT:</span>
            <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${threatScore}%`,
                  backgroundColor: threatLevel.color,
                }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-white min-w-[2.5rem]">
              {threatScore}/100
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${threatLevel.badgeClass}`}
            >
              {threatLevel.level}
            </span>
          </div>

          {/* Perspective Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-soc-border">
            <button
              onClick={() => setPerspective('defender')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                perspective === 'defender'
                  ? 'bg-soc-cyan/20 text-cyan-300 border border-soc-cyan/40 shadow-sm'
                  : 'text-soc-textMuted hover:text-white'
              }`}
              title="View as SecOps Defender (Reveals honeypot markers and canary flags)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Defender</span>
            </button>
            <button
              onClick={() => setPerspective('attacker')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                perspective === 'attacker'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                  : 'text-soc-textMuted hover:text-white'
              }`}
              title="View as Attacker (Decoys disguised as normal assets)"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Attacker</span>
            </button>
          </div>

          {/* Run Demo Attack CTA */}
          <button
            onClick={onRunDemo}
            disabled={isScriptedRunning}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg font-mono transition-all duration-200 shadow-md ${
              isScriptedRunning
                ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300 cursor-wait'
                : 'bg-soc-cyan hover:bg-cyan-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.02]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isScriptedRunning ? 'animate-spin' : ''}`} />
            {isScriptedRunning ? `Replaying Demo (Step ${scriptedStep}/9)...` : 'Run Demo Attack'}
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-soc-border bg-slate-900/60 hover:bg-slate-800 text-soc-textMuted hover:text-white transition-colors"
            title="Clear all recorded events and reset simulation to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Export Report CTA */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-soc-border bg-slate-900/60 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Download JSON forensic incident report"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 mt-3 border-t border-soc-border/60 pt-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-soc-surface text-cyan-300 border border-soc-borderLight font-semibold'
              : 'text-soc-textMuted hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'network'
              ? 'bg-soc-surface text-cyan-300 border border-soc-borderLight font-semibold'
              : 'text-soc-textMuted hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Network Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-soc-surface text-cyan-300 border border-soc-borderLight font-semibold'
              : 'text-soc-textMuted hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Attack Simulator</span>
          <span className="px-1.5 py-0.2 text-[10px] bg-red-950/80 text-red-300 rounded font-mono">
            {currentNodeId}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'incidents'
              ? 'bg-soc-surface text-cyan-300 border border-soc-borderLight font-semibold'
              : 'text-soc-textMuted hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Incidents & Timeline</span>
        </button>
      </div>
    </header>
  );
};
