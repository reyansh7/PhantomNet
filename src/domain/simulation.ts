import {
  EventType,
  IntrusionEvent,
  NodeId,
  SimulationSession,
} from './types';
import { THREAT_RULES } from './rules';
import { getAllowedTransitions } from '../data/networkSeed';
import { INITIAL_DECOYS } from '../data/decoysSeed';

export interface PerformActionParams {
  type: EventType;
  targetNodeId?: NodeId;
  assetId?: string;
  customExplanation?: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
  event?: IntrusionEvent;
  updatedSession: SimulationSession;
}

let eventCounter = 1;

export function generateEventId(): string {
  const time = Date.now().toString(36);
  const count = (eventCounter++).toString().padStart(4, '0');
  return `evt-${time}-${count}`;
}

export function createInitialSession(): SimulationSession {
  const startedAt = new Date().toISOString();
  const initialEvent: IntrusionEvent = {
    id: generateEventId(),
    sessionId: `sess-${Date.now().toString(36)}`,
    timestamp: startedAt,
    type: 'SESSION_STARTED',
    actor: 'simulated-attacker',
    sourceNodeId: 'gateway',
    targetNodeId: 'gateway',
    severity: 'info',
    scoreDelta: 0,
    explanation: 'Simulated attacker established connection to Perimeter Gateway (192.0.2.10).',
    evidence: 'Inbound TLS session initiated from external source to monitored ingress portal.',
  };

  return {
    id: initialEvent.sessionId,
    startedAt,
    currentNodeId: 'gateway',
    events: [initialEvent],
  };
}

/**
 * Validates whether an action is permissible from the current simulation state.
 */
export function validateAction(
  session: SimulationSession,
  params: PerformActionParams
): { valid: boolean; reason?: string } {
  const { currentNodeId } = session;

  // 1. Lateral move validation: Target must be adjacent in the network graph
  if (params.type === 'LATERAL_MOVE_ATTEMPT') {
    if (!params.targetNodeId) {
      return { valid: false, reason: 'Target host must be specified for lateral move.' };
    }
    if (params.targetNodeId === currentNodeId) {
      return { valid: false, reason: `Attacker is already resident on ${currentNodeId}.` };
    }
    const allowedHops = getAllowedTransitions(currentNodeId);
    if (!allowedHops.includes(params.targetNodeId)) {
      return {
        valid: false,
        reason: `Direct lateral pivot from ${currentNodeId} to ${params.targetNodeId} is blocked by network routing segmentation. Valid next hops: [${allowedHops.join(', ')}].`,
      };
    }
  }

  // 2. Asset interaction validation: Attacker must be on the node that hosts the asset
  if (
    params.type === 'SENSITIVE_FILE_OPENED' ||
    params.type === 'HONEYTOKEN_VIEWED' ||
    params.type === 'BROWSE_DIRECTORY'
  ) {
    if (params.assetId) {
      const asset = INITIAL_DECOYS.find((a) => a.id === params.assetId);
      if (asset && asset.nodeId !== currentNodeId) {
        return {
          valid: false,
          reason: `Cannot interact with asset '${asset.label}' located on '${asset.nodeId}' while current compromise is on '${currentNodeId}'. Move to '${asset.nodeId}' first.`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Executes a simulated attacker action, appending an immutable event if valid.
 */
export function appendSimulationEvent(
  session: SimulationSession,
  params: PerformActionParams
): ActionResult {
  const validation = validateAction(session, params);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.reason || 'Action rejected by simulation engine.',
      updatedSession: session,
    };
  }

  const rule = THREAT_RULES[params.type];
  const now = new Date().toISOString();
  const sourceNode = session.currentNodeId;
  const targetNode = params.targetNodeId || session.currentNodeId;

  let assetLabel: string | undefined;
  if (params.assetId) {
    const asset = INITIAL_DECOYS.find((a) => a.id === params.assetId);
    if (asset) {
      assetLabel = asset.label;
    }
  }

  let nextCurrentNode = session.currentNodeId;
  if (params.type === 'LATERAL_MOVE_ATTEMPT' && params.targetNodeId) {
    nextCurrentNode = params.targetNodeId;
  }

  const newEvent: IntrusionEvent = {
    id: generateEventId(),
    sessionId: session.id,
    timestamp: now,
    type: params.type,
    actor: 'simulated-attacker',
    sourceNodeId: sourceNode,
    targetNodeId: targetNode,
    assetId: params.assetId,
    assetLabel,
    severity: rule.baseSeverity,
    scoreDelta: rule.scoreDelta,
    explanation:
      params.customExplanation ||
      (params.type === 'LATERAL_MOVE_ATTEMPT'
        ? `Attacker successfully pivoted lateral boundary from ${sourceNode} to ${targetNode}.`
        : params.type === 'SENSITIVE_FILE_OPENED'
        ? `Decoy sensitive file '${assetLabel || 'canary'}' opened on ${targetNode}.`
        : params.type === 'HONEYTOKEN_VIEWED'
        ? `Synthetic honeytoken credential '${assetLabel || 'secret'}' inspected on ${targetNode}.`
        : params.type === 'FAKE_CREDENTIAL_USED'
        ? `Synthetic decoy credential deployed for authentication against ${targetNode}.`
        : params.type === 'LOGIN_FAILED'
        ? `Brute force authentication probe failed on ${targetNode} monitored portal.`
        : params.type === 'SCAN_HOST'
        ? `Reconnaissance port scan executed on ${targetNode}.`
        : `Directory listing enumeration executed on ${targetNode}.`),
    evidence: rule.generateEvidence({
      sourceNodeId: sourceNode,
      targetNodeId: targetNode,
      assetId: params.assetId,
      assetLabel,
    }),
  };

  const updatedSession: SimulationSession = {
    ...session,
    currentNodeId: nextCurrentNode,
    events: [...session.events, newEvent],
  };

  return {
    success: true,
    message: `Event [${params.type}] successfully recorded.`,
    event: newEvent,
    updatedSession,
  };
}
