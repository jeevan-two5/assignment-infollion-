import React from 'react';
import './Toolbar.css';

export default function Toolbar({
  searchTerm,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
  onResetView,
  totalNodes,
  visibleNodes,
}) {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__logo">⬡</span>
        <span className="toolbar__title">Tree Visualizer</span>
      </div>

      <div className="toolbar__center">
        <div className="toolbar__search-wrap">
          <span className="toolbar__search-icon">⌕</span>
          <input
            type="text"
            className="toolbar__search"
            placeholder="Search nodes…"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button className="toolbar__search-clear" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="toolbar__actions">
        <span className="toolbar__stat">
          {visibleNodes}/{totalNodes} nodes
        </span>
        <button className="toolbar__btn" onClick={onExpandAll} title="Expand all nodes">
          <span>⊞</span> Expand All
        </button>
        <button className="toolbar__btn" onClick={onCollapseAll} title="Collapse all nodes">
          <span>⊟</span> Collapse All
        </button>
        <button className="toolbar__btn toolbar__btn--outline" onClick={onResetView} title="Fit view">
          <span>⊡</span> Fit View
        </button>
      </div>
    </header>
  );
}
