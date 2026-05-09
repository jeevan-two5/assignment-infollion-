import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Toolbar from './components/Toolbar';
import TreeNode from './components/TreeNode';
import {
  DEFAULT_TREE,
  buildFlowElements,
  getAllNodeIds,
  getDescendantIds,
  findNode,
} from './treeUtils';
import './App.css';

// ─── Node types registration ───────────────────────────────────────────────────
const nodeTypes = { treeNode: TreeNode };

// ─── Inner component (needs ReactFlowProvider context) ────────────────────────
function TreeVisualizer() {
  const { fitView } = useReactFlow();

  const [collapsedSet, setCollapsedSet] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const treeRef = useRef(DEFAULT_TREE);

  // ─── Re-build flow whenever collapsed/search/selection changes ──────────────
  const rebuildFlow = useCallback(() => {
    const { flowNodes, flowEdges } = buildFlowElements(
      treeRef.current,
      collapsedSet,
      searchTerm,
      selectedId
    );

    // Inject callbacks into node data
    const enriched = flowNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onToggle: handleToggle,
        onSelect: handleSelect,
      },
    }));

    setNodes(enriched);
    setEdges(flowEdges);
  }, [collapsedSet, searchTerm, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    rebuildFlow();
    // Fit view after layout changes with a short delay
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 60);
  }, [collapsedSet, searchTerm, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Toggle collapse/expand for a node ─────────────────────────────────────
  const handleToggle = useCallback((nodeId) => {
    setCollapsedSet(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
        // Also collapse all descendants
        const node = findNode(treeRef.current, nodeId);
        if (node) {
          getDescendantIds(node).forEach(id => next.delete(id));
        }
      }
      return next;
    });
  }, []);

  // ─── Select a node ──────────────────────────────────────────────────────────
  const handleSelect = useCallback((nodeId) => {
    setSelectedId(prev => (prev === nodeId ? null : nodeId));
  }, []);

  // ─── Expand all nodes ───────────────────────────────────────────────────────
  const handleExpandAll = useCallback(() => {
    setCollapsedSet(new Set());
  }, []);

  // ─── Collapse all non-root nodes that have children ─────────────────────────
  const handleCollapseAll = useCallback(() => {
    const allIds = getAllNodeIds(treeRef.current);
    const withChildren = allIds.filter(id => {
      const n = findNode(treeRef.current, id);
      return n && n.children && n.children.length > 0 && id !== treeRef.current.id;
    });
    // Collapse only root level (direct children of root that have children)
    const rootChildrenWithKids = (treeRef.current.children || [])
      .filter(c => c.children && c.children.length > 0)
      .map(c => c.id);
    setCollapsedSet(new Set(rootChildrenWithKids));
  }, []);

  // ─── Fit view ───────────────────────────────────────────────────────────────
  const handleResetView = useCallback(() => {
    fitView({ padding: 0.2, duration: 500 });
  }, [fitView]);

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const totalNodes = useMemo(() => getAllNodeIds(treeRef.current).length, []);
  const visibleNodes = nodes.length;

  return (
    <div className="app">
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onResetView={handleResetView}
        totalNodes={totalNodes}
        visibleNodes={visibleNodes}
      />

      <div className="app__canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.1}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant="dots" gap={24} size={1} />
          <Controls />
          <MiniMap
            nodeColor={() => '#252836'}
            maskColor="rgba(10,12,16,0.7)"
          />
        </ReactFlow>

        {/* Legend */}
        <div className="legend">
          <div className="legend__item">
            <span className="legend__dot legend__dot--collapse" />
            Collapse
          </div>
          <div className="legend__item">
            <span className="legend__dot legend__dot--expand" />
            Expand
          </div>
          <div className="legend__item">
            <span className="legend__dot legend__dot--search" />
            Search match
          </div>
          <div className="legend__item">
            <span className="legend__dot legend__dot--selected" />
            Selected
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root export (wraps with provider) ───────────────────────────────────────
export default function App() {
  return (
    <ReactFlowProvider>
      <TreeVisualizer />
    </ReactFlowProvider>
  );
}
