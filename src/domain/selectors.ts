import {
  Alert,
  AttackPathStep,
  IncidentReport,
  NodeId,
  NodeStatus,
  SimulationSession,
} from './types';
import { calculateThreatScore, evaluateEventAlert, getThreatLevel } from './rules';
import { INITIAL_DECOYS } from '../data/decoysSeed';

/**
 * Derives all alerts triggered by the session's recorded events.
 */
export function deriveAlerts(session: SimulationSession): Alert[] {
  const alerts: Alert[] = [];
  for (const evt of session.events) {
    const alert = evaluateEventAlert(evt);
    if (alert) {
      alerts.push(alert);
    }
  }
  // Chronological or newest first based on use
  return alerts;
}

/**
 * Derives current threat score (0 - 100).
 */
export function deriveThreatScore(session: SimulationSession): number {
  return calculateThreatScore(session.events);
}

/**
 * Derives threat level metadata.
 */
export function deriveThreatLevel(session: SimulationSession) {
  return getThreatLevel(deriveThreatScore(session));
}

/**
 * Derives the sequenced attacker path across nodes and edges.
 */
export function deriveAttackPath(session: SimulationSession): {
  visitedNodeIds: Set<NodeId>;
  traversedEdgeIds: Set<string>;
  steps: AttackPathStep[];
  pathNodes: NodeId[];
} {
  const visitedNodeIds = new Set<NodeId>(['gateway']);
  const traversedEdgeIds = new Set<string>();
  const steps: AttackPathStep[] = [];
  const pathNodes: NodeId[] = ['gateway'];

  for (const event of session.events) {
    if (event.type === 'LATERAL_MOVE_ATTEMPT' && event.sourceNodeId && event.targetNodeId) {
      visitedNodeIds.add(event.targetNodeId);
      pathNodes.push(event.targetNodeId);
      steps.push({
        fromNodeId: event.sourceNodeId,
        toNodeId: event.targetNodeId,
        timestamp: event.timestamp,
        eventId: event.id,
        type: event.type,
      });

      // Find edge id matching source and target (undirected)
      const u = event.sourceNodeId;
      const v = event.targetNodeId;
      traversedEdgeIds.add(`e-${u}-${v}`);
      traversedEdgeIds.add(`e-${v}-${u}`);
    } else if (event.targetNodeId) {
      visitedNodeIds.add(event.targetNodeId);
    }
  }

  return {
    visitedNodeIds,
    traversedEdgeIds,
    steps,
    pathNodes,
  };
}

/**
 * Derives operational status (healthy, suspicious, triggered) for each node.
 */
export function deriveNodeStatuses(
  session: SimulationSession
): Record<NodeId, NodeStatus> {
  const statuses: Record<NodeId, NodeStatus> = {
    gateway: 'healthy',
    web: 'healthy',
    workstation: 'healthy',
    finance: 'healthy',
    database: 'healthy',
    'decoy-vault': 'healthy',
  };

  for (const evt of session.events) {
    const target = evt.targetNodeId;
    if (!target) continue;

    // Triggered: Decoy document opened, fake credential used, or honeytoken inspected
    if (
      evt.type === 'SENSITIVE_FILE_OPENED' ||
      evt.type === 'HONEYTOKEN_VIEWED' ||
      evt.type === 'FAKE_CREDENTIAL_USED'
    ) {
      statuses[target] = 'triggered';
    } else if (
      (evt.type === 'SCAN_HOST' ||
        evt.type === 'LOGIN_FAILED' ||
        evt.type === 'LATERAL_MOVE_ATTEMPT') &&
      statuses[target] !== 'triggered'
    ) {
      statuses[target] = 'suspicious';
    }
  }

  return statuses;
}

/**
 * Derives the comprehensive incident report object.
 */
export function deriveIncidentReport(session: SimulationSession): IncidentReport {
  const score = deriveThreatScore(session);
  const alerts = deriveAlerts(session);
  const path = deriveAttackPath(session);

  const alertCounts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    low: alerts.filter((a) => a.severity === 'low').length,
    info: alerts.filter((a) => a.severity === 'info').length,
  };

  const triggeredDecoys: IncidentReport['triggeredDecoys'] = [];
  const seenAssets = new Set<string>();

  for (const evt of session.events) {
    if (
      evt.assetId &&
      !seenAssets.has(evt.assetId) &&
      (evt.type === 'SENSITIVE_FILE_OPENED' ||
        evt.type === 'HONEYTOKEN_VIEWED' ||
        evt.type === 'FAKE_CREDENTIAL_USED')
    ) {
      seenAssets.add(evt.assetId);
      const asset = INITIAL_DECOYS.find((a) => a.id === evt.assetId);
      if (asset) {
        triggeredDecoys.push({
          assetId: asset.id,
          assetLabel: asset.label,
          honeytokenId: asset.honeytokenId,
          nodeId: asset.nodeId,
          touchedAt: evt.timestamp,
        });
      }
    }
  }

  let classification = 'Reconnaissance / Probing';
  if (score >= 75) {
    classification = 'CONFIRMED INTRUSION — Decoy Canary Breached (P1 Critical)';
  } else if (score >= 40) {
    classification = 'SUSPECTED LATERAL BREACH — Honeytoken Accessed (P2 High)';
  } else if (score >= 15) {
    classification = 'UNAUTHORIZED ACTIVE PROBING — Elevated Threat (P3 Medium)';
  }

  const recommendations: string[] = [];
  if (alertCounts.critical > 0) {
    recommendations.push(
      'Immediately isolate targeted host from internal VLAN routing.',
      'Revoke synthetic credential lineage and verify production identity store integrity.',
      'Blackhole simulated pivot IP address at perimeter edge.'
    );
  }
  if (alertCounts.high > 0) {
    recommendations.push(
      'Export canary access logs to enterprise SIEM for forensic correlation.',
      'Deploy secondary adaptive honeytokens on adjacent subnets.'
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Continue baseline passive monitoring. No canary tripwires breached.',
      'Maintain perimeter egress filtering rules.'
    );
  }

  const firstEventTime = session.events[0]?.timestamp || session.startedAt;
  const lastEventTime =
    session.events[session.events.length - 1]?.timestamp || session.startedAt;
  const durationSeconds = Math.max(
    0,
    Math.round(
      (new Date(lastEventTime).getTime() - new Date(firstEventTime).getTime()) / 1000
    )
  );

  return {
    sessionId: session.id,
    generatedAt: new Date().toISOString(),
    startedAt: session.startedAt,
    durationSeconds,
    threatScore: score,
    classification,
    summary: `Simulated intrusion session '${session.id}' recorded ${session.events.length} telemetry events across ${path.visitedNodeIds.size} network hosts. Attacker triggered ${alerts.length} high-signal deception alerts resulting in threat score ${score}/100.`,
    currentNode: session.currentNodeId,
    totalEvents: session.events.length,
    alertCounts,
    attackTrajectory: path.pathNodes,
    triggeredDecoys,
    timeline: [...session.events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    ),
    alerts,
    recommendations,
  };
}
