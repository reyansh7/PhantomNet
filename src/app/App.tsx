import { useSimulationStore } from '../hooks/useSimulationStore';
import { Header } from '../components/layout/Header';
import { KpiCards } from '../components/layout/KpiCards';
import { OverviewTab } from '../components/overview/OverviewTab';
import { NetworkGraph } from '../components/network/NetworkGraph';
import { NodeDetailsPanel } from '../components/network/NodeDetailsPanel';
import { AttackerConsole } from '../components/simulation/AttackerConsole';
import { AssetPreviewModal } from '../components/simulation/AssetPreviewModal';
import { AlertsPanel } from '../components/incidents/AlertsPanel';
import { TimelineView } from '../components/incidents/TimelineView';
import { IncidentReportView } from '../components/incidents/IncidentReportView';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Terminal,
} from 'lucide-react';

export default function App() {
  const {
    session,
    selectedNodeId,
    setSelectedNodeId,
    activeTab,
    setActiveTab,
    perspective,
    setPerspective,
    activeAssetPreview,
    setActiveAssetPreview,
    statusMessage,
    isScriptedRunning,
    scriptedStep,
    alerts,
    threatScore,
    threatLevel,
    attackPath,
    nodeStatuses,
    incidentReport,
    performAction,
    resetSimulation,
    runScriptedDemo,
  } = useSimulationStore();

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(incidentReport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `phantomnet-incident-${incidentReport.sessionId}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-soc-bg text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        perspective={perspective}
        setPerspective={setPerspective}
        threatScore={threatScore}
        threatLevel={threatLevel}
        currentNodeId={session.currentNodeId}
        isScriptedRunning={isScriptedRunning}
        scriptedStep={scriptedStep}
        onRunDemo={runScriptedDemo}
        onResetDemo={resetSimulation}
        onExportReport={handleExportJson}
      />

      {/* 2. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Status Toast / Notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-all animate-in slide-in-from-top-2 shadow-lg ${
              statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/50 text-red-200'
                : statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              ) : statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <span className="text-[10px] text-slate-400">TELEMETRY ACK</span>
          </div>
        )}

        {/* Global KPI Cards */}
        <KpiCards
          threatScore={threatScore}
          threatLevel={threatLevel}
          currentNodeId={session.currentNodeId}
          totalAlerts={alerts.length}
          criticalAlerts={alerts.filter((a) => a.severity === 'critical').length}
          highAlerts={alerts.filter((a) => a.severity === 'high').length}
          nodeStatuses={nodeStatuses}
          visitedNodesCount={attackPath.visitedNodeIds.size}
          eventsCount={session.events.length}
        />

        {/* Perspective Banner */}
        {perspective === 'attacker' ? (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-200 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-400" />
              <span>
                <strong>Attacker Recon Mode Active:</strong> Decoy badges are concealed. You are viewing assets as an adversary would see them.
              </span>
            </div>
            <button
              onClick={() => setPerspective('defender')}
              className="px-2 py-0.5 rounded bg-red-900/60 hover:bg-red-800 text-white font-bold transition-colors"
            >
              Switch to Defender View
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-soc-card border border-soc-border rounded-xl flex items-center justify-between text-xs text-soc-textMuted font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-soc-cyan" />
              <span>
                <strong>SecOps Defender Mode Active:</strong> Canaries and honeypot tags highlighted in green/cyan.
              </span>
            </div>
            <span className="text-[10px] text-soc-textDim">
              Deterministic Rule Engine Loaded
            </span>
          </div>
        )}

        {/* Tab View Router */}
        {activeTab === 'overview' && (
          <OverviewTab
            currentNodeId={session.currentNodeId}
            alerts={alerts}
            nodeStatuses={nodeStatuses}
            attackTrajectory={attackPath.pathNodes}
            report={incidentReport}
            perspective={perspective}
            onRunDemo={runScriptedDemo}
            onResetDemo={resetSimulation}
            setActiveTab={setActiveTab}
            onOpenAssetPreview={setActiveAssetPreview}
            isScriptedRunning={isScriptedRunning}
          />
        )}

        {activeTab === 'network' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 h-[600px]">
              <NetworkGraph
                currentNodeId={session.currentNodeId}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                nodeStatuses={nodeStatuses}
                attackPath={attackPath}
                perspective={perspective}
              />
            </div>

            <div className="h-[600px]">
              {selectedNodeId ? (
                <NodeDetailsPanel
                  selectedNodeId={selectedNodeId}
                  currentNodeId={session.currentNodeId}
                  nodeStatuses={nodeStatuses}
                  perspective={perspective}
                  onOpenAssetPreview={setActiveAssetPreview}
                  onPerformAction={performAction}
                />
              ) : (
                <div className="bg-soc-card border border-soc-border rounded-xl p-8 text-center text-soc-textDim h-full flex flex-col items-center justify-center">
                  <Layers className="w-8 h-8 mb-2 text-slate-700" />
                  <p className="font-mono text-xs">Select any network node to inspect specifications and deployed canaries.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <AttackerConsole
            currentNodeId={session.currentNodeId}
            events={session.events}
            onPerformAction={performAction}
            onOpenAssetPreview={setActiveAssetPreview}
            onRunDemo={runScriptedDemo}
            isScriptedRunning={isScriptedRunning}
          />
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsPanel alerts={alerts} />
              <TimelineView events={session.events} />
            </div>

            <IncidentReportView report={incidentReport} />
          </div>
        )}
      </main>

      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={activeAssetPreview}
        currentNodeId={session.currentNodeId}
        perspective={perspective}
        onClose={() => setActiveAssetPreview(null)}
        onInteract={(asset) => {
          if (asset.kind === 'file') {
            performAction({
              type: 'SENSITIVE_FILE_OPENED',
              targetNodeId: asset.nodeId,
              assetId: asset.id,
            });
          } else if (asset.kind === 'credential') {
            performAction({
              type: 'HONEYTOKEN_VIEWED',
              targetNodeId: asset.nodeId,
              assetId: asset.id,
            });
          } else {
            performAction({
              type: 'LOGIN_FAILED',
              targetNodeId: asset.nodeId,
              assetId: asset.id,
            });
          }
        }}
      />

      {/* 3. Footer */}
      <footer className="border-t border-soc-border bg-soc-card/70 py-4 px-6 text-xs text-soc-textDim font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-soc-cyan" />
            <span>PHANTOMNET v1.0 • Cyber Deception & Reconstructed Intrusion Path</span>
          </div>
          <div>
            <span>RFC 5737 TEST-NET (192.0.2.0/24) • Inert Synthetic Sandbox • No Real Attacks</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
