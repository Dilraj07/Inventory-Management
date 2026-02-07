import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Max-Heap visualization with side-by-side array and tree views.
 * White background, Poppins font, no emojis.
 */
export const MaxHeapVisualization = ({ data, onNodeClick }) => {
  const { raw_array = [], tree = {} } = data || {};
  const { nodes = [], edges = [] } = tree;

  const layout = useMemo(() => {
    if (!nodes.length) return { positions: {}, width: 0, height: 0 };

    const positions = {};
    const nodeWidth = 90;
    const levelHeight = 80;

    const getDepth = (index) => Math.floor(Math.log2(index + 1));
    const maxDepth = nodes.length > 0 ? getDepth(nodes.length - 1) : 0;

    nodes.forEach((node, index) => {
      const depth = getDepth(index);
      const nodesAtLevel = Math.pow(2, depth);
      const positionInLevel = index - (Math.pow(2, depth) - 1);

      const levelWidth = nodesAtLevel * nodeWidth * 1.4;
      const startX = (Math.pow(2, maxDepth) * nodeWidth * 1.4 - levelWidth) / 2;
      const x = startX + (positionInLevel + 0.5) * (levelWidth / nodesAtLevel);
      const y = depth * levelHeight + 30;

      positions[node.id] = { x, y };
    });

    return {
      positions,
      width: Math.pow(2, maxDepth) * nodeWidth * 1.4,
      height: (maxDepth + 1) * levelHeight + 60
    };
  }, [nodes]);

  if (!raw_array.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No shipping queue data
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Array View */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          Raw Array (Max-Heap)
        </h4>
        <div className="flex flex-wrap gap-2">
          {raw_array.map((item, idx) => (
            <motion.div
              key={item.order_id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative p-3 rounded-lg border text-center min-w-[80px] cursor-pointer transition-all hover:shadow-md ${idx === 0
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : item.priority_reason === 'VIP'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              onClick={() => onNodeClick?.(item)}
            >
              <div className="text-[10px] text-gray-400 absolute top-1 left-1">
                [{idx}]
              </div>
              <div className="text-xs font-semibold mt-2">{item.order_id}</div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Score: {item.priority_score}
              </div>
              {item.priority_reason === 'VIP' && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-gray-900 text-white px-1 rounded font-semibold">
                  VIP
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Array index labels */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Parent: (i-1)/2 | Left: 2i+1 | Right: 2i+2
          </p>
        </div>
      </div>

      {/* Tree View */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-auto">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-900"></span>
          Tree Structure
        </h4>
        <svg
          width={Math.max(layout.width, 400)}
          height={Math.max(layout.height, 250)}
          className="mx-auto"
        >
          {/* Edges */}
          {edges.map((edge, idx) => {
            const fromPos = layout.positions[edge.from];
            const toPos = layout.positions[edge.to];
            if (!fromPos || !toPos) return null;

            return (
              <motion.line
                key={`edge-${idx}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.2 }}
                x1={fromPos.x}
                y1={fromPos.y + 20}
                x2={toPos.x}
                y2={toPos.y - 20}
                stroke="#d1d5db"
                strokeWidth={2}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const pos = layout.positions[node.id];
            if (!pos) return null;

            const isRoot = idx === 0;
            const isVIP = node.reason === 'VIP';

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onNodeClick?.(node)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill={isRoot ? '#111827' : isVIP ? '#374151' : '#6b7280'}
                  stroke={isRoot ? '#000' : '#e5e7eb'}
                  strokeWidth={isRoot ? 3 : 1}
                  className="transition-all hover:brightness-110"
                />

                <text
                  x={pos.x}
                  y={pos.y - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize={9}
                  fontWeight="600"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {node.label}
                </text>

                <text
                  x={pos.x}
                  y={pos.y + 8}
                  textAnchor="middle"
                  fill="#d1d5db"
                  fontSize={8}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  P:{node.value}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default MaxHeapVisualization;
