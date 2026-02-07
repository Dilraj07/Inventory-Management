import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Binary tree visualization for Min-Heap.
 * White background, black typography, Poppins font.
 */
export const MinHeapTree = ({ data, onNodeClick }) => {
  const { nodes = [], edges = [] } = data?.tree || {};

  const layout = useMemo(() => {
    if (!nodes.length) return { positions: {}, width: 0, height: 0 };

    const positions = {};
    const nodeWidth = 100;
    const nodeHeight = 60;
    const levelHeight = 90;

    const getDepth = (index) => Math.floor(Math.log2(index + 1));
    const maxDepth = nodes.length > 0 ? getDepth(nodes.length - 1) : 0;

    nodes.forEach((node, index) => {
      const depth = getDepth(index);
      const nodesAtLevel = Math.pow(2, depth);
      const positionInLevel = index - (Math.pow(2, depth) - 1);

      const levelWidth = nodesAtLevel * nodeWidth * 1.5;
      const startX = (Math.pow(2, maxDepth) * nodeWidth * 1.5 - levelWidth) / 2;
      const x = startX + (positionInLevel + 0.5) * (levelWidth / nodesAtLevel);
      const y = depth * levelHeight + 40;

      positions[node.id] = { x, y };
    });

    return {
      positions,
      width: Math.pow(2, maxDepth) * nodeWidth * 1.5,
      height: (maxDepth + 1) * levelHeight + 80
    };
  }, [nodes]);

  if (!nodes.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No heap data available
      </div>
    );
  }

  return (
    <div className="relative overflow-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <svg
        width={Math.max(layout.width, 600)}
        height={Math.max(layout.height, 300)}
        className="mx-auto"
      >
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const fromPos = layout.positions[edge.from];
          const toPos = layout.positions[edge.to];
          if (!fromPos || !toPos) return null;

          return (
            <motion.line
              key={`edge-${idx}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              x1={fromPos.x}
              y1={fromPos.y + 25}
              x2={toPos.x}
              y2={toPos.y - 25}
              stroke="#d1d5db"
              strokeWidth={2}
            />
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node, idx) => {
          const pos = layout.positions[node.id];
          if (!pos) return null;

          const isRoot = idx === 0;
          const isCritical = node.value < 7;
          const isWarning = node.value >= 7 && node.value < 15;

          // Color scheme: grayscale with accent for critical
          const bgColor = isRoot ? '#111827' : isCritical ? '#dc2626' : isWarning ? '#f59e0b' : '#6b7280';
          const textColor = '#ffffff';

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onClick={() => onNodeClick?.(node)}
              className="cursor-pointer"
            >
              {/* Node background */}
              <rect
                x={pos.x - 45}
                y={pos.y - 25}
                width={90}
                height={50}
                rx={8}
                fill={bgColor}
                stroke={isRoot ? '#000000' : '#e5e7eb'}
                strokeWidth={isRoot ? 3 : 1}
                className="transition-all duration-200 hover:brightness-110"
              />

              {/* Root indicator */}
              {isRoot && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y - 35}
                  r={8}
                  fill="#111827"
                  stroke="#000"
                  strokeWidth={2}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* SKU label */}
              <text
                x={pos.x}
                y={pos.y - 5}
                textAnchor="middle"
                fill={textColor}
                fontSize={11}
                fontWeight="600"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {node.label}
              </text>

              {/* Days remaining */}
              <text
                x={pos.x}
                y={pos.y + 12}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize={10}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {node.value} days
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-900"></div>
          <span className="text-xs text-gray-600">Root (Min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-600"></div>
          <span className="text-xs text-gray-600">Critical (less than 7 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500"></div>
          <span className="text-xs text-gray-600">Warning (7-14 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500"></div>
          <span className="text-xs text-gray-600">Stable</span>
        </div>
      </div>
    </div>
  );
};

export default MinHeapTree;
