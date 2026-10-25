import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  DecoyAsset,
  NodeId,
  SimulationSession,
} from '../domain/types';
import {
  createInitialSession,
  appendSimulationEvent,
  PerformActionParams,
} from '../domain/simulation';
import {
  deriveAlerts,
  deriveThreatScore,
  deriveThreatLevel,
  deriveAttackPath,
  deriveNodeStatuses,
  deriveIncidentReport,
} from '../domain/selectors';
import { INITIAL_DECOYS } from '../data/decoysSeed';

const STORAGE_KEY = 'phantomnet_session_v1';

export type Perspective = 'defender' | 'attacker';
export type ActiveTab = 'overview' | 'network' | 'simulator' | 'incidents';

export function useSimulationStore() {
  const [session, setSession] = useState<SimulationSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.events && Array.isArray(parsed.events)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore session from localStorage:', e);
    }
    return createInitialSession();
  });

  const [selectedNodeId, setSelectedNodeId] = useState<NodeId | null>('gateway');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [perspective, setPerspective] = useState<Perspective>('defender');
  const [activeAssetPreview, setActiveAssetPreview] = useState<DecoyAsset | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isScriptedRunning, setIsScriptedRunning] = useState(false);
  const [scriptedStep, setScriptedStep] = useState(0);

  // Sync session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e);
    }
  }, [session]);

  // Derived state memoization (computed only when session updates)
  const alerts = useMemo(() => deriveAlerts(session), [session]);
  const threatScore = useMemo(() => deriveThreatScore(session), [session]);
  const threatLevel = useMemo(() => deriveThreatLevel(session), [session]);
  const attackPath = useMemo(() => deriveAttackPath(session), [session]);
  const nodeStatuses = useMemo(() => deriveNodeStatuses(session), [session]);
  const incidentReport = useMemo(() => deriveIncidentReport(session), [session]);

  const showNotification = useCallback((text: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  }, []);

  const performAction = useCallback((params: PerformActionParams) => {
    let resultOutcome: { success: boolean; message: string } | null = null;
    setSession((currSession) => {
      const result = appendSimulationEvent(currSession, params);
      resultOutcome = { success: result.success, message: result.message };
      return result.updatedSession;
    });

    if (resultOutcome) {
      const { success, message } = resultOutcome;
      showNotification(message, success ? 'success' : 'error');
      return success;
    }
    return false;
  }, [showNotification]);

  const resetSimulation = useCallback(() => {
    const newSession = createInitialSession();
    setSession(newSession);
    setSelectedNodeId('gateway');
    setActiveAssetPreview(null);
    setIsScriptedRunning(false);
    setScriptedStep(0);
    localStorage.removeItem(STORAGE_KEY);
    showNotification('Simulation session fully reset to baseline state.', 'info');
  }, [showNotification]);

  // Scripted Demo Runner: Step-by-step golden scenario
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const stopScriptedDemo = useCallback(() => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
    setIsScriptedRunning(false);
  }, []);

  const runScriptedDemo = useCallback(() => {
    stopScriptedDemo();
    // Reset to clean state first
    const freshSession = createInitialSession();
    setSession(freshSession);
    setSelectedNodeId('gateway');
    setIsScriptedRunning(true);
    setScriptedStep(1);

    const scriptSteps: Array<{
      delay: number;
      action: PerformActionParams;
      focusNode: NodeId;
      stepNum: number;
      assetPreviewId?: string;
    }> = [
      // Step 1: Scan Gateway
      {
        delay: 500,
        action: { type: 'SCAN_HOST', targetNodeId: 'gateway' },
        focusNode: 'gateway',
        stepNum: 1,
      },
      // Step 2: Lateral pivot to Web Server
      {
        delay: 1800,
        action: { type: 'LATERAL_MOVE_ATTEMPT', targetNodeId: 'web' },
        focusNode: 'web',
        stepNum: 2,
      },
      // Step 3: Browse Web Server directory
      {
        delay: 3100,
        action: { type: 'BROWSE_DIRECTORY', targetNodeId: 'web' },
        focusNode: 'web',
        stepNum: 3,
      },
      // Step 4: Lateral pivot to Finance Server
      {
        delay: 4400,
        action: { type: 'LATERAL_MOVE_ATTEMPT', targetNodeId: 'finance' },
        focusNode: 'finance',
        stepNum: 4,
      },
      // Step 5: Open decoy payroll_Q3_2026.xlsx on Finance Server
      {
        delay: 5800,
        action: {
          type: 'SENSITIVE_FILE_OPENED',
          targetNodeId: 'finance',
          assetId: 'asset-payroll-file',
        },
        focusNode: 'finance',
        stepNum: 5,
        assetPreviewId: 'asset-payroll-file',
      },
      // Step 6: Pivot to Decoy Vault & inspect fake root credential
      {
        delay: 7400,
        action: { type: 'LATERAL_MOVE_ATTEMPT', targetNodeId: 'decoy-vault' },
        focusNode: 'decoy-vault',
        stepNum: 6,
      },
      {
        delay: 8800,
        action: {
          type: 'HONEYTOKEN_VIEWED',
          targetNodeId: 'decoy-vault',
          assetId: 'asset-admin-token',
        },
        focusNode: 'decoy-vault',
        stepNum: 7,
        assetPreviewId: 'asset-admin-token',
      },
      // Step 7: Pivot to Database & attempt synthetic credential replay
      {
        delay: 10400,
        action: { type: 'LATERAL_MOVE_ATTEMPT', targetNodeId: 'database' },
        focusNode: 'database',
        stepNum: 8,
      },
      {
        delay: 11900,
        action: {
          type: 'FAKE_CREDENTIAL_USED',
          targetNodeId: 'database',
          customExplanation: 'Attacker attempted root database authentication replay using captured canary credentials.',
        },
        focusNode: 'database',
        stepNum: 9,
      },
    ];

    scriptSteps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setSession((prev) => {
          const res = appendSimulationEvent(prev, step.action);
          return res.updatedSession;
        });
        setSelectedNodeId(step.focusNode);
        setScriptedStep(step.stepNum);

        if (step.assetPreviewId) {
          const decoy = INITIAL_DECOYS.find((d) => d.id === step.assetPreviewId);
          if (decoy) setActiveAssetPreview(decoy);
        }

        if (idx === scriptSteps.length - 1) {
          setIsScriptedRunning(false);
          showNotification('Demo attack script completed. Full incident report compiled.', 'success');
        }
      }, step.delay);
      timeoutRefs.current.push(t);
    });
  }, [stopScriptedDemo, showNotification]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return {
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
    stopScriptedDemo,
  };
}
