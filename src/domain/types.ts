export type NodeId = 
  | 'gateway' 
  | 'web' 
  | 'workstation' 
  | 'finance' 
  | 'database' 
  | 'decoy-vault';

export type NodeStatus = 'healthy' | 'suspicious' | 'triggered';

export type AssetKind = 'file' | 'credential' | 'endpoint';

export interface DecoyAsset {
  id: string;
  nodeId: NodeId;
  kind: AssetKind;
  label: string;
  honeytokenId: string;
  preview: string;
  isHoneytoken: boolean;
  metadata?: Record<string, string>;
}

export interface NetworkNodeDef {
  id: NodeId;
  label: string;
  ip: string;
  role: string;
  description: string;
  isDecoy: boolean;
  tags: string[];
  os: string;
  services: string[];
  position: { x: number; y: number };
}

export interface NetworkEdgeDef {
  id: string;
  source: NodeId;
  target: NodeId;
  label?: string;
  bidirectional?: boolean;
}

export type EventType =
  | 'SESSION_STARTED'
  | 'SCAN_HOST'
  | 'BROWSE_DIRECTORY'
  | 'LOGIN_FAILED'
  | 'SENSITIVE_FILE_OPENED'
  | 'HONEYTOKEN_VIEWED'
  | 'FAKE_CREDENTIAL_USED'
  | 'LATERAL_MOVE_ATTEMPT';

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface IntrusionEvent {
  id: string;
  sessionId: string;
  timestamp: string; // ISO 8601
  type: EventType;
  actor: 'simulated-attacker' | 'system';
  sourceNodeId?: NodeId;
  targetNodeId?: NodeId;
  assetId?: string;
  assetLabel?: string;
  severity: Severity;
  scoreDelta: number;
  explanation: string;
  evidence?: string;
}

export interface Alert {
  id: string;
  eventId: string;
  timestamp: string;
  severity: Severity;
  title: string;
  nodeId: NodeId;
  assetId?: string;
  honeytokenId?: string;
  evidence: string;
  description: string;
}

export interface SimulationSession {
  id: string;
  startedAt: string;
  currentNodeId: NodeId;
  events: IntrusionEvent[];
}

export interface AttackPathStep {
  fromNodeId?: NodeId;
  toNodeId: NodeId;
  timestamp: string;
  eventId: string;
  type: EventType;
}

export interface IncidentReport {
  sessionId: string;
  generatedAt: string;
  startedAt: string;
  durationSeconds: number;
  threatScore: number;
  classification: string;
  summary: string;
  currentNode: NodeId;
  totalEvents: number;
  alertCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  attackTrajectory: NodeId[];
  triggeredDecoys: Array<{
    assetId: string;
    assetLabel: string;
    honeytokenId: string;
    nodeId: NodeId;
    touchedAt: string;
  }>;
  timeline: IntrusionEvent[];
  alerts: Alert[];
  recommendations: string[];
}
