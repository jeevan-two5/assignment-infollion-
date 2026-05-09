# Tree Visualizer — Infollion Task 4

A visual hierarchical tree renderer built with **React** and **React Flow**.

---

## Features

| Feature | Details |
|---|---|
| **Tree Layout** | Parent nodes centered above their children; siblings spaced cleanly |
| **Edges** | Smooth-step edges connecting parent → child |
| **Expand / Collapse** | Click the ● button on any node that has children |
| **Auto-layout** | Spacing recalculates instantly when a subtree is collapsed or expanded |
| **Search** | Type in the search bar to highlight matching nodes in green |
| **Node Selection** | Click any node to select/highlight it |
| **Node Metadata** | Click the `i` button on any node to see its type, depth, and description |
| **Expand All / Collapse All** | Toolbar buttons to control the entire tree at once |
| **Fit View** | Toolbar "Fit View" button, or use the Controls panel (bottom-right) |
| **Minimap** | Bottom-right minimap for navigating large trees |
| **Zoom / Pan** | Standard React Flow zoom and pan |
| **Drag Nodes** | Nodes can be freely repositioned by dragging |

---

## Tree Structure (default data)

```
Root
├── A
│   ├── A1
│   │   ├── A1a
│   │   └── A1b
│   └── A2
├── B
│   ├── B1
│   └── B2
│       └── B2a
└── C
    ├── C1
    ├── C2
    └── C3
```

Depth reaches **4 levels** (Root → A → A1 → A1a), satisfying the 3–6 level constraint.

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# 1. Navigate to the project directory
cd tree-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000**.

### Production Build

```bash
npm run build
```

Output goes to the `build/` folder and can be served with any static file host.

---

## Project Structure

```
tree-visualizer/
├── public/
│   └── index.html          # HTML shell + Google Fonts
├── src/
│   ├── components/
│   │   ├── TreeNode.jsx    # Custom React Flow node component
│   │   ├── TreeNode.css    # Node styles (hover, select, collapse, meta)
│   │   ├── Toolbar.jsx     # Top toolbar (search, expand/collapse, fit view)
│   │   └── Toolbar.css
│   ├── App.jsx             # Root component, state management, React Flow setup
│   ├── App.css             # App-level layout + legend
│   ├── index.js            # React entry point
│   ├── index.css           # Global CSS variables + React Flow overrides
│   └── treeUtils.js        # Tree data, layout algorithm, flow builder
├── package.json
└── README.md
```

---

## How the Layout Works

1. `getSubtreeWidth(node, collapsed)` — recursively computes the pixel-width a node needs by summing its visible children's widths plus gaps.
2. `assignPositions(node, ...)` — walks the tree top-down, placing each node horizontally centred over its subtree.
3. `buildFlowElements(tree, collapsed, search, selected)` — calls the above and returns the `nodes[]` and `edges[]` arrays React Flow consumes.
4. On every toggle/search/select change, `rebuildFlow()` reruns these steps and `fitView()` is called with a 400 ms animation.

---

## Customising the Tree

Edit `src/treeUtils.js` → `DEFAULT_TREE`. Each node has the shape:

```js
{
  id: 'unique-string',
  label: 'Display Label',
  meta: {
    type: 'Leaf | Branch | Root Node',
    depth: 0,
    description: 'Optional text shown in the info popup',
  },
  children: [ /* nested nodes */ ],
}
```

Spacing constants (`NODE_WIDTH`, `H_GAP`, `V_GAP`) are also defined at the top of `treeUtils.js`.

---

## Tech Stack

- **React 18**
- **React Flow 11** (`reactflow`)
- **CSS Custom Properties** (no external UI library)
- **Google Fonts** — Syne (display) + JetBrains Mono (code/mono)
