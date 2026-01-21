import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, CheckCircle, Clock, ArrowRight, Info, Play, Pause } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const AuditSchedule = () => {
  const [auditSequence, setAuditSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(true);

  // Fetch audit sequence
  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/audit/next');
      // Get more items to show the circular nature (request will cycle)
      const sequence = response.data.audit_sequence || [];
      setAuditSequence(sequence);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  // Auto-advance animation
  useEffect(() => {
    let interval;
    if (isAnimating && auditSequence.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % auditSequence.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnimating, auditSequence.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % auditSequence.length);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <RefreshCw className="animate-spin" size={20} />
          Loading audit schedule...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Audit Schedule</h2>
          <p className="text-slate-500 text-sm">Circular Linked List Visualization</p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors"
        >
          <Info size={16} />
          {showExplanation ? 'Hide' : 'Show'} DSA Info
        </button>
      </div>

      {/* DSA Explanation Panel */}
      {showExplanation && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">7</div>
            Circular Linked List - Audit Scheduling
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-indigo-800">What it is:</p>
              <p className="text-slate-600">A linked list where the last node points back to the first, creating an endless cycle.</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-indigo-800">Why use it here:</p>
              <p className="text-slate-600">Warehouse audits need continuous rotation. Every product must be checked periodically - no product forgotten.</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="font-medium text-indigo-800">Time Complexity:</p>
              <p className="text-slate-600"><code className="bg-indigo-100 px-1 rounded">O(1)</code> to get next item - just move the pointer.</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Circular Representation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-slate-800">Circular Audit Rotation</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAnimation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isAnimating
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                }`}
            >
              {isAnimating ? <Pause size={16} /> : <Play size={16} />}
              {isAnimating ? 'Pause' : 'Auto-Cycle'}
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all"
            >
              <ArrowRight size={16} />
              Next Item
            </button>
          </div>
        </div>

        {/* Circular Visual */}
        <div className="relative flex justify-center items-center py-8">
          {/* Circle Background */}
          <div className="relative w-80 h-80">
            {/* Dotted Circle */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-200"></div>

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 shadow-inner">
                <RefreshCw className="mx-auto text-indigo-400 mb-2" size={24} />
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Circular</p>
                <p className="text-xs text-slate-500">Never Ends</p>
              </div>
            </div>

            {/* Nodes */}
            {auditSequence.map((sku, index) => {
              const angle = (index / auditSequence.length) * 2 * Math.PI - Math.PI / 2;
              const x = 140 + 120 * Math.cos(angle);
              const y = 140 + 120 * Math.sin(angle);
              const isActive = index === currentIndex;
              const isPassed = index < currentIndex;

              return (
                <div
                  key={index}
                  className={`absolute w-20 h-20 -ml-10 -mt-10 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-500 ${isActive
                    ? 'bg-sky-500 border-sky-600 text-white shadow-lg shadow-sky-200 scale-110 z-10'
                    : isPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  style={{
                    left: x,
                    top: y,
                  }}
                >
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
                      <Clock size={12} className="text-white" />
                    </div>
                  )}
                  {isPassed && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                  <span className={`text-[10px] font-medium ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                    {isActive ? 'AUDITING' : isPassed ? 'DONE' : `#${index + 1}`}
                  </span>
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-white' : ''}`}>
                    {sku}
                  </span>
                </div>
              );
            })}

            {/* Arrows between nodes */}
            {auditSequence.map((_, index) => {
              const angle = (index / auditSequence.length) * 2 * Math.PI - Math.PI / 2;
              const nextAngle = ((index + 1) / auditSequence.length) * 2 * Math.PI - Math.PI / 2;
              const midAngle = (angle + nextAngle) / 2;
              const x = 140 + 100 * Math.cos(midAngle);
              const y = 140 + 100 * Math.sin(midAngle);
              const rotation = (midAngle * 180) / Math.PI + 90;

              return (
                <div
                  key={`arrow-${index}`}
                  className="absolute text-slate-300"
                  style={{
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Audit Item</p>
              <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                {auditSequence[currentIndex]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Position in Cycle</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {currentIndex + 1} <span className="text-slate-400 text-lg">/ {auditSequence.length}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Next Up</p>
              <p className="text-lg font-mono text-sky-600 mt-1">
                {auditSequence[(currentIndex + 1) % auditSequence.length]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Linear Timeline View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Audit Timeline (Linear View)</h3>
        <p className="text-sm text-slate-500 mb-4">
          The sequence continues forever - when it reaches the end, it cycles back to the start.
        </p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / auditSequence.length) * 100}%` }}
          ></div>

          {/* Timeline Items */}
          <div className="flex justify-between relative z-10">
            {auditSequence.map((sku, index) => {
              const isActive = index === currentIndex;
              const isPassed = index < currentIndex;

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive
                      ? 'bg-sky-500 text-white scale-125 shadow-lg shadow-sky-200'
                      : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                      }`}
                  >
                    {isPassed ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <p className={`mt-2 text-xs font-mono ${isActive ? 'text-sky-600 font-bold' : 'text-slate-500'}`}>
                    {sku}
                  </p>
                </div>
              );
            })}
            {/* Back to Start Indicator */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center shadow-md">
                <RefreshCw size={14} className="text-white" />
              </div>
              <p className="mt-2 text-xs text-purple-600 font-medium">
                Restart
              </p>
            </div>
          </div>
        </div>

        {/* Cycle Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <RefreshCw size={14} className="text-indigo-400" />
          <span>After <strong>{auditSequence[auditSequence.length - 1]}</strong>, the pointer moves back to <strong>{auditSequence[0]}</strong> - infinite cycle!</span>
        </div>
      </div>
    </div>
  );
};

export default AuditSchedule;
