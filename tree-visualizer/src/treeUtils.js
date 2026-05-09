// ─── Default Tree Data ────────────────────────────────────────────────────────
export const DEFAULT_TREE = {
  id: 'root',
  label: 'Root',
  meta: { type: 'Root Node', depth: 0, description: 'Top-level node of the tree' },
  children: [
    {
      id: 'A',
      label: 'A',
      meta: { type: 'Branch', depth: 1, description: 'First branch of root' },
      children: [
        {
          id: 'A1',
          label: 'A1',
          meta: { type: 'Leaf', depth: 2, description: 'First child of A' },
          children: [
            {
              id: 'A1a',
              label: 'A1a',
              meta: { type: 'Leaf', depth: 3, description: 'Deep leaf node' },
              children: [],
            },
            {
              id: 'A1b',
              label: 'A1b',
              meta: { type: 'Leaf', depth: 3, description: 'Deep leaf node' },
              children: [],
            },
          ],
        },
        {
          id: 'A2',
          label: 'A2',
          meta: { type: 'Leaf', depth: 2, description: 'Second child of A' },
          children: [],
        },
      ],
    },
    {
      id: 'B',
      label: 'B',
      meta: { type: 'Branch', depth: 1, description: 'Second branch of root' },
      children: [
        {
          id: 'B1',
          label: 'B1',
          meta: { type: 'Leaf', depth: 2, description: 'First child of B' },
          children: [],
        },
        {
          id: 'B2',
          label: 'B2',
          meta: { type: 'Leaf', depth: 2, description: 'Second child of B' },
          children: [
            {
              id: 'B2a',
              label: 'B2a',
              meta: { type: 'Leaf', depth: 3, description: 'Deep leaf node' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'C',
      label: 'C',
      meta: { type: 'Branch', depth: 1, description: 'Third branch of root' },
      children: [
        {
          id: 'C1',
          label: 'C1',
          meta: { type: 'Leaf', depth: 2, description: 'First child of C' },
          children: [],
        },
        {
          id: 'C2',
          label: 'C2',
          meta: { type: 'Leaf', depth: 2, description: 'Second child of C' },
          children: [],
        },
        {
          id: 'C3',
          label: 'C3',
          meta: { type: 'Leaf', depth: 2, description: 'Third child of C' },
          children: [],
        },
      ],
    },
  ],
};

// ─── Layout Constants ─────────────────────────────────────────────────────────
const NODE_WIDTH = 140;
const NODE_HEIGHT = 56;
const H_GAP = 40;   // horizontal gap between siblings
const V_GAP = 100;  // vertical gap between levels

// ─── Compute subtree width (accounting for collapsed state) ───────────────────
export function getSubtreeWidth(node, collapsedSet) {
  if (collapsedSet.has(node.id) || !node.children || node.children.length === 0) {
    return NODE_WIDTH;
  }
  const childrenTotal = node.children.reduce((sum, child, i) => {
    return sum + getSubtreeWidth(child, collapsedSet) + (i > 0 ? H_GAP : 0);
  }, 0);
  return Math.max(NODE_WIDTH, childrenTotal);
}

// ─── Assign x/y positions recursively ────────────────────────────────────────
export function assignPositions(node, collapsedSet, xOffset, depth, positions) {
  const subtreeW = getSubtreeWidth(node, collapsedSet);
  const cx = xOffset + subtreeW / 2;
  const y = depth * (NODE_HEIGHT + V_GAP);

  positions[node.id] = { x: cx - NODE_WIDTH / 2, y };

  if (!collapsedSet.has(node.id) && node.children && node.children.length > 0) {
    let childX = xOffset;
    for (const child of node.children) {
      assignPositions(child, collapsedSet, childX, depth + 1, positions);
      childX += getSubtreeWidth(child, collapsedSet) + H_GAP;
    }
  }
}

// ─── Build React Flow nodes & edges from tree ─────────────────────────────────
export function buildFlowElements(treeNode, collapsedSet, searchTerm, selectedId) {
  const positions = {};
  assignPositions(treeNode, collapsedSet, 0, 0, positions);

  const flowNodes = [];
  const flowEdges = [];

  function traverse(node, parentId) {
    const pos = positions[node.id];
    if (!pos) return;

    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedSet.has(node.id);
    const isSelected = selectedId === node.id;

    const matchesSearch =
      searchTerm &&
      node.label.toLowerCase().includes(searchTerm.toLowerCase());

    flowNodes.push({
      id: node.id,
      type: 'treeNode',
      position: pos,
      data: {
        label: node.label,
        meta: node.meta,
        hasChildren,
        isCollapsed,
        isSelected,
        matchesSearch: !!matchesSearch,
      },
      style: { width: NODE_WIDTH },
    });

    if (parentId) {
      flowEdges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        className: isSelected ? 'highlighted' : '',
      });
    }

    if (!isCollapsed && hasChildren) {
      for (const child of node.children) {
        traverse(child, node.id);
      }
    }
  }

  traverse(treeNode, null);
  return { flowNodes, flowEdges };
}

// ─── Collect all node ids in the tree ────────────────────────────────────────
export function getAllNodeIds(node) {
  const ids = [node.id];
  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllNodeIds(child));
    }
  }
  return ids;
}

// ─── Find all descendant ids ──────────────────────────────────────────────────
export function getDescendantIds(node) {
  const ids = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id, ...getDescendantIds(child));
    }
  }
  return ids;
}

// ─── Find node by id ──────────────────────────────────────────────────────────
export function findNode(root, id) {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}
