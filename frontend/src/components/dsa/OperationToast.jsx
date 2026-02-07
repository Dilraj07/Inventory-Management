import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Toast notification for operation feedback.
 * White theme, Poppins font, no emojis.
 */
export const OperationToast = ({ operation, result, complexity, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100] bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[300px]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <span className="text-gray-700 font-semibold text-lg">fn</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-900 font-medium text-sm">
            Operation: <span className="font-semibold">{operation}</span>
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            Result: {result}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Complexity: {complexity}
          </p>
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 3, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 origin-left rounded-b-xl"
      />
    </motion.div>
  );
};

export default OperationToast;
