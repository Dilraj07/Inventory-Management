import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * Hash Set visualization for safety gate (blocked lots).
 * White background, Poppins font, no emojis.
 */
export const HashSetGate = ({ data, testLot, onTest }) => {
  const { blocked_lots = [], buckets = [] } = data || {};

  return (
    <div className="space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Blocked Lots Display */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ShieldAlert size={14} className="text-gray-500" />
          Blocked Lots (Hash Set Contents)
        </h4>
        <div className="flex flex-wrap gap-2">
          {blocked_lots.length === 0 ? (
            <p className="text-gray-400 text-sm">No blocked lots</p>
          ) : (
            blocked_lots.map((lot, idx) => (
              <motion.span
                key={lot}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm"
              >
                {lot}
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Hash Buckets Visualization */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Hash Buckets (Internal Structure)
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {buckets.map((bucket) => (
            <div
              key={bucket.index}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="text-[10px] text-gray-400 mb-2">
                Bucket [{bucket.index}]
              </div>
              {bucket.items.length === 0 ? (
                <div className="text-gray-300 text-xs italic">empty</div>
              ) : (
                <div className="space-y-1">
                  {bucket.items.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ backgroundColor: 'rgba(107, 114, 128, 0.3)' }}
                      animate={{ backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs truncate"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* O(1) Lookup Demo */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ShieldCheck size={14} className="text-gray-500" />
          O(1) Membership Test
        </h4>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter lot ID to check..."
            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTest?.(e.target.value);
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="lot ID"]');
              onTest?.(input?.value);
            }}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Check
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Hash function maps lot ID to bucket index in constant time.
        </p>
      </div>
    </div>
  );
};

export default HashSetGate;
