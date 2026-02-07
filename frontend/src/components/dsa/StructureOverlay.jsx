import React, { useState } from 'react';
import { X, GitBranch, Zap, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen overlay for displaying data structure visualizations.
 * White background, black typography, Poppins font, zoom controls.
 */
export const StructureOverlay = ({
  isOpen,
  onClose,
  title,
  type,
  description,
  complexity,
  rawData,
  children
}) => {
  const [viewMode, setViewMode] = useState('structure');
  const [zoom, setZoom] = useState(1);
  const [operationLog, setOperationLog] = useState([]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const handleZoomReset = () => setZoom(1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-900">
              <GitBranch size={20} />
              <span className="text-lg font-semibold">{title}</span>
            </div>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 uppercase">
              {type?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="px-2 text-sm text-gray-600 min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleZoomReset}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('structure')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${viewMode === 'structure'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Structure
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${viewMode === 'json'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Raw JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Visualization Area */}
          <div className="flex-1 p-6 overflow-auto bg-gray-50">
            {viewMode === 'structure' ? (
              <div className="h-full">
                {/* Description */}
                <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-gray-700 text-sm">{description}</p>
                  {complexity && (
                    <div className="flex gap-4 mt-3">
                      {Object.entries(complexity).map(([op, comp]) => (
                        <div key={op} className="flex items-center gap-2 text-xs">
                          <Zap size={12} className="text-gray-400" />
                          <span className="text-gray-500 capitalize">{op.replace('_', ' ')}:</span>
                          <span className="text-gray-900 font-medium">{comp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Children (actual visualization) with zoom */}
                <div
                  className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px] overflow-auto"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`
                  }}
                >
                  {children}
                </div>
              </div>
            ) : (
              <div className="h-full">
                <pre className="bg-white rounded-xl border border-gray-200 p-6 overflow-auto h-full text-sm text-gray-800">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Operation Log Sidebar */}
          <div className="w-72 border-l border-gray-200 bg-white flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Zap size={14} className="text-gray-400" />
                Operation Log
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {operationLog.length === 0 ? (
                <p className="text-gray-400 text-xs text-center mt-8">
                  Click nodes to see complexity logs here.
                </p>
              ) : (
                operationLog.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-gray-900 text-xs font-semibold">
                        {log.operation}
                      </span>
                      <span className="text-gray-400 text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-gray-600 text-xs mb-1">{log.result}</p>
                    <span className="text-gray-500 text-xs">
                      Complexity: {log.complexity}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StructureOverlay;
