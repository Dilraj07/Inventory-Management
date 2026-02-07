import React from 'react';
import { Terminal } from 'lucide-react';

/**
 * Terminal button component for opening DSA structure overlays.
 * Minimal black/white design, Poppins font.
 */
export const TerminalButton = ({ onClick, label = "View Structure" }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm transition-all duration-200 border border-gray-700 shadow-sm hover:shadow-md"
      title={label}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Terminal size={14} className="group-hover:scale-110 transition-transform" />
      <span className="text-xs font-medium">View</span>
    </button>
  );
};

export default TerminalButton;
