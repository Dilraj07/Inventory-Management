import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * BST visualization with left/right subtree coloring.
 * White background, Poppins font, no emojis.
 */
export const BSTVisualization = ({ data, highlightPath, onNodeClick }) => {
  const { tree = {}, in_order_path = [] } = data || {};
  const { nodes = [], edges = [] } = tree;

  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [nodes]);

  const layout = useMemo(() => {
    if (!nodes.length) return { positions: {}, width: 0, height: 0 };

    const positions = {};
    const nodeWidth = 100;
    const levelHeight = 80;

    const children = {};
    edges.forEach(e => {
      if (!children[e.from]) children[e.from] = { left: null, right: null };
      if (e.side === 'left') children[e.from].left = e.to;
      else children[e.from].right = e.to;
    });

    const hasIncoming = new Set(edges.map(e => e.to));
    const root = nodes.find(n => !hasIncoming.has(n.id))?.id || nodes[0]?.id;

    let xCounter = 0;
    const assignPositions = (nodeId, depth) => {
      if (!nodeId || !nodeMap[nodeId]) return;

      const nodeChildren = children[nodeId] || {};

      if (nodeChildren.left) assignPositions(nodeChildren.left, depth + 1);

      positions[nodeId] = {
        x: xCounter * nodeWidth + 60,
        y: depth * levelHeight + 40
      };
      xCounter++;

      if (nodeChildren.right) assignPositions(nodeChildren.right, depth + 1);
    };

    assignPositions(root, 0);

    return {
      positions,
      width: (xCounter + 1) * nodeWidth,
      height: 400
    };
  }, [nodes, edges, nodeMap]);

  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No BST data available
      </div>
    );
  }

  return (
    <div className="relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <svg
        width={Math.max(layout.width, 800)}
        height={layout.height}
        className="mx-auto"
      >
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const fromPos = layout.positions[edge.from];
          const toPos = layout.positions[edge.to];
          if (!fromPos || !toPos) return null;

          return (
            <motion.path
              key={`edge-${idx}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
              d={`M ${fromPos.x} ${fromPos.y + 20} Q ${(fromPos.x + toPos.x) / 2} ${(fromPos.y + toPos.y) / 2 + 10} ${toPos.x} ${toPos.y - 20}`}
              stroke={edge.side === 'left' ? '#991b1b' : '#166534'}
              strokeWidth={2}
              fill="none"
              strokeOpacity={0.6}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node, idx) => {
          const pos = layout.positions[node.id];
          if (!pos) return null;

          const pathIndex = in_order_path.indexOf(node.sku);
          const isInPath = pathIndex !== -1;

          const bgColor =
            node.status === 'critical' ? '#dc2626' :
              node.status === 'warning' ? '#f59e0b' : '#22c55e';

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onNodeClick?.(node)}
              className="cursor-pointer"
            >
              {/* Path order indicator */}
              {isInPath && (
                <motion.circle
                  cx={pos.x + 35}
                  cy={pos.y - 25}
                  r={12}
                  fill="#374151"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: pathIndex * 0.1 }}
                />
              )}
              {isInPath && (
                <text
                  x={pos.x + 35}
                  y={pos.y - 21}
                  textAnchor="middle"
                  fill="white"
                  fontSize={9}
                  fontWeight="bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {pathIndex + 1}
                </text>
              )}

              {/* Node */}
              <rect
                x={pos.x - 40}
                y={pos.y - 20}
                width={80}
                height={40}
                rx={6}
                fill={bgColor}
                stroke={node.id === nodes[0]?.id ? '#000' : 'transparent'}
                strokeWidth={2}
                className="transition-all hover:brightness-110"
              />

              <text
                x={pos.x}
                y={pos.y - 3}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontWeight="600"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {node.sku}
              </text>

              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize={9}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {node.days_remaining}d
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-xs text-gray-600">Critical (less than 7d)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-600">Warning (7-14d)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Stable (15d+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700"></div>
          <span className="text-xs text-gray-600">In-Order Traversal</span>
        </div>
      </div>

      {/* Traversal Path Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">In-Order Traversal (L to Root to R):</p>
        <div className="flex flex-wrap gap-1">
          {in_order_path.slice(0, 15).map((sku, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
            >
              {sku}
            </span>
          ))}
          {in_order_path.length > 15 && (
            <span className="text-gray-400 text-xs">+{in_order_path.length - 15} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BSTVisualization;
