import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import './TreeNode.css';

const TreeNode = memo(({ data, id }) => {
  const {
    label,
    meta,
    hasChildren,
    isCollapsed,
    isSelected,
    matchesSearch,
    onToggle,
    onSelect,
  } = data;

  const [hovered, setHovered] = useState(false);
  const [showMeta, setShowMeta] = useState(false);

  const nodeClass = [
    'tree-node',
    isSelected ? 'tree-node--selected' : '',
    matchesSearch ? 'tree-node--match' : '',
    hovered ? 'tree-node--hovered' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={nodeClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowMeta(false); }}
      onClick={() => onSelect && onSelect(id)}
    >
      {/* Top handle (receives connections from parent) */}
      <Handle
        type="target"
        position={Position.Top}
        className="tree-handle tree-handle--top"
      />

      <div className="tree-node__inner">
        {/* Metadata dot */}
        {meta && (
          <button
            className="tree-node__meta-btn"
            onClick={e => {
              e.stopPropagation();
              setShowMeta(v => !v);
            }}
            title="Node info"
          >
            i
          </button>
        )}

        <span className="tree-node__label">{label}</span>

        {/* Expand/Collapse button */}
        {hasChildren && (
          <button
            className={`tree-node__toggle ${isCollapsed ? 'tree-node__toggle--collapsed' : ''}`}
            onClick={e => {
              e.stopPropagation();
              onToggle && onToggle(id);
            }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '+' : '−'}
          </button>
        )}
      </div>

      {/* Metadata tooltip */}
      {showMeta && meta && (
        <div className="tree-node__meta-card" onClick={e => e.stopPropagation()}>
          <div className="tree-node__meta-row">
            <span className="tree-node__meta-key">Type</span>
            <span className="tree-node__meta-val">{meta.type}</span>
          </div>
          <div className="tree-node__meta-row">
            <span className="tree-node__meta-key">Depth</span>
            <span className="tree-node__meta-val">{meta.depth}</span>
          </div>
          {meta.description && (
            <div className="tree-node__meta-row">
              <span className="tree-node__meta-key">Info</span>
              <span className="tree-node__meta-val">{meta.description}</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom handle (emits connections to children) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="tree-handle tree-handle--bottom"
      />
    </div>
  );
});

export default TreeNode;
