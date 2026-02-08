import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity, Zap, Database, TrendingUp } from 'lucide-react';

// Export the addLog function so it can be called from axios interceptors
let logCallback = null;

export const setLogCallback = (callback) => {
  logCallback = callback;
};

// Constants
const MAX_TERMINAL_LOGS = 100; // Increased for presentations
const TERMINAL_MAX_HEIGHT = 'calc(100vh - 200px)';

export const addTerminalLog = (type, message) => {
  if (logCallback) {
    logCallback(type, message);
  }
};

// Memoized log item component for performance
const LogItem = React.memo(({ log, getLogColor, getLogIcon }) => (
  <div className="flex items-start gap-3 hover:bg-slate-800/50 px-2 py-1 rounded transition-colors">
    <span className="text-slate-500 shrink-0 text-[10px]">[{log.timestamp}]</span>
    <span className={`font-bold shrink-0 ${getLogColor(log.type)} min-w-[80px]`}>
      <span className="inline-flex items-center gap-1">
        {getLogIcon(log.type)}
        {log.type}
      </span>
    </span>
    <span className="text-slate-300 flex-1">{log.message}</span>
  </div>
));

export function LiveTerminal() {
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // Set up the callback for external logging
    const addLog = (type, message) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs((prev) => [...prev.slice(-MAX_TERMINAL_LOGS), { type, message, timestamp }]);
    };

    setLogCallback(addLog);

    // Add initial welcome message
    addLog('SYSTEM', 'Live Terminal ready. Waiting for application activity...');
    addLog('INFO', 'Backend API: http://127.0.0.1:8000');
    addLog('INFO', 'Frontend: http://localhost:5173');

    return () => {
      setLogCallback(null);
    };
  }, []);

  const getLogColor = (type) => {
    switch (type) {
      case 'SYSTEM':
        return 'text-cyan-400';
      case 'INFO':
        return 'text-slate-400';
      case 'API':
        return 'text-green-400';
      case 'POST':
        return 'text-blue-400';
      case 'PUT':
        return 'text-yellow-400';
      case 'DELETE':
        return 'text-rose-400';
      case 'DB':
        return 'text-orange-400';
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'API':
      case 'POST':
      case 'PUT':
      case 'DELETE':
        return <Zap size={14} />;
      case 'DB':
        return <Database size={14} />;
      case 'SUCCESS':
      case 'ERROR':
        return <TrendingUp size={14} />;
      default:
        return <Activity size={14} />;
    }
  };

  return (
    <div className="h-full bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="text-emerald-400" size={20} />
          <h3 className="text-sm font-bold text-slate-200">Live Application Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-xs text-slate-400 font-mono">MONITORING</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-1"
        style={{ maxHeight: TERMINAL_MAX_HEIGHT }}
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 text-center py-8">
            Waiting for activity...
          </div>
        ) : (
          logs.map((log, index) => (
            <LogItem
              key={`${log.timestamp}-${index}`}
              log={log}
              getLogColor={getLogColor}
              getLogIcon={getLogIcon}
            />
          ))
        )}
      </div>

      {/* Terminal Footer */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          {logs.length} events logged
        </span>
        <button
          onClick={() => setLogs([])}
          className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
