import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNetworkNode, CustomNodeData } from './CustomNetworkNode';
import { INITIAL_NODES, INITIAL_EDGES } from '../../data/networkSeed';
import { INITIAL_DECOYS } from '../../data/decoysSeed';
import { NodeId, NodeStatus } from '../../domain/types';
import { Perspective } from '../../hooks/useSimulationStore';

interface NetworkGraphProps {
  currentNodeId: NodeId;
  selectedNodeId: NodeId | null;
  setSelectedNodeId: (id: NodeId) => void;
  nodeStatuses: Record<NodeId, NodeStatus>;
  attackPath: {
    visitedNodeIds: Set<NodeId>;
    traversedEdgeIds: Set<string>;
  };
  perspective: Perspective;
}

const nodeTypes = {
  customNode: CustomNetworkNode,
};

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  currentNodeId,
  selectedNodeId,
  setSelectedNodeId,
  nodeStatuses,
  attackPath,
  perspective,
}) => {
  // Compute React Flow nodes
  const nodes: Node<CustomNodeData>[] = useMemo(() => {
    return INITIAL_NODES.map((def) => {
      const decoyCount = INITIAL_DECOYS.filter((d) => d.nodeId === def.id).length;
      return {
        id: def.id,
        type: 'customNode',
        position: def.position,
        data: {
          id: def.id,
          label: def.label,
          ip: def.ip,
          role: def.role,
          isDecoy: def.isDecoy,
          status: nodeStatuses[def.id] || 'healthy',
          isCurrentAttackerNode: currentNodeId === def.id,
          isVisited: attackPath.visitedNodeIds.has(def.id),
          perspective,
          decoyAssetsCount: decoyCount,
          isSelected: selectedNodeId === def.id,
        },
      };
    });
  }, [nodeStatuses, currentNodeId, attackPath, perspective, selectedNodeId]);

  // Compute React Flow edges with dynamic traversed attack-path animations
  const edges: Edge[] = useMemo(() => {
    return INITIAL_EDGES.map((edgeDef) => {
      const isTraversed =
        attackPath.traversedEdgeIds.has(edgeDef.id) ||
        attackPath.traversedEdgeIds.has(`e-${edgeDef.target}-${edgeDef.source}`);

      if (isTraversed) {
        return {
          id: edgeDef.id,
          source: edgeDef.source,
          target: edgeDef.target,
          label: '⚔️ Traversed Pivot',
          labelStyle: { fill: '#fca5a5', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 },
          labelBgStyle: { fill: '#450a0a', stroke: '#ef4444', strokeWidth: 1 },
          animated: true,
          style: {
            stroke: '#ef4444',
            strokeWidth: 3.5,
            filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8))',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#ef4444',
            width: 16,
            height: 16,
          },
        };
      }

      return {
        id: edgeDef.id,
        source: edgeDef.source,
        target: edgeDef.target,
        label: edgeDef.label,
        labelStyle: { fill: '#64748b', fontSize: 9, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0b1120', stroke: '#1e293b', strokeWidth: 1 },
        style: {
          stroke: '#1e293b',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
        },
      };
    });
  }, [attackPath]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-soc-bg rounded-xl border border-soc-border overflow-hidden">
      {/* Legend / Overlay Header */}
      <div className="absolute top-3 left-3 z-10 bg-soc-card/90 backdrop-blur-md border border-soc-border p-2.5 rounded-lg flex flex-wrap items-center gap-3 text-[11px] font-mono pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-soc-textMuted">Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-soc-textMuted">Suspicious</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-bold">Triggered Tripwire</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-soc-border pl-2">
          <span className="w-3.5 h-1 bg-red-500 rounded" />
          <span className="text-red-300">Reconstructed Trajectory</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id as NodeId);
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-soc-bg"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#1e293b" />
        <Controls className="!bg-soc-card !border-soc-border !text-slate-300 fill-slate-300" />
      </ReactFlow>
    </div>
  );
};
