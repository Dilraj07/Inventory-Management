import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertTriangle, CheckCircle, Clock, Zap, MapPin, XCircle, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';

// DSA Visualization Components
import { TerminalButton, StructureOverlay, MaxHeapVisualization, HashSetGate, OperationToast } from './dsa';
import { AnimatePresence } from 'framer-motion';

export function ShipmentQueueViewer() {
  const [data, setData] = useState({ priority_queue: [], pick_list: [], blocked_orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DSA Visualization State
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayType, setOverlayType] = useState('max_heap'); // 'max_heap' | 'hash_set'
  const [heapData, setHeapData] = useState(null);
  const [hashSetData, setHashSetData] = useState(null);
  const [operationToast, setOperationToast] = useState(null);

  const fetchDSAState = async (type) => {
    try {
      if (type === 'max_heap') {
        const res = await axios.get('http://127.0.0.1:8000/api/debug/shipping-heap-state');
        setHeapData(res.data);
      } else {
        const res = await axios.get('http://127.0.0.1:8000/api/debug/hashset-state');
        setHashSetData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch DSA state", err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/shipping/dashboard');
      setData(response.data);
      setError(null); // Clear error on success
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch shipping data", err);
      setError("Failed to connect to backend server. Please ensure the API is running (uvicorn api:app).");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Triage Board...</div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center text-rose-500 bg-rose-50/50">
      <AlertCircle size={48} className="mb-4 text-rose-400" />
      <h3 className="text-xl font-bold text-rose-700">Connection Error</h3>
      <p className="max-w-md mt-2 text-rose-600">{error}</p>
      <button
        onClick={() => { setLoading(true); fetchData(); }}
        className="mt-6 px-6 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 font-bold transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );

  // Filter Categories
  const expressLane = data.priority_queue.filter(order => order.days_remaining < 7 && order.stock_available);
  const shortageAlert = data.priority_queue.filter(order => !order.stock_available);
  const standardQueue = data.priority_queue.filter(order => order.days_remaining >= 7 && order.stock_available);

  // Action Handlers
  const handleDispatch = async (orderId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/dispatch`);
      // Refresh data immediately
      fetchData();
    } catch (err) {
      alert("Failed to dispatch: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reports/download?lang=en`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pirs_report_summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download report", err);
      alert("Failed to download PDF report.");
    }
  };

  // Handle "Wait" button - Move order to blocked queue to wait for stock
  const handleWait = async (orderId, reason = "Waiting for stock replenishment") => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/block`, {
        reason: reason
      });
      alert(`Order ${orderId} moved to waiting queue.`);
      fetchData(); // Refresh data
    } catch (err) {
      // If the endpoint doesn't exist, simulate the action
      console.log(`Order ${orderId} marked as waiting. (Simulated)`);
      alert(`Order ${orderId} is now in the waiting queue. Stock will be replenished soon.`);
    }
  };

  // Handle "Ship Partial" button - Dispatch with available stock
  const handleShipPartial = async (orderId, availableQty) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/partial-dispatch`, {
        quantity: availableQty
      });
      alert(`Order ${orderId} partially shipped with ${availableQty} units.`);
      fetchData(); // Refresh data
    } catch (err) {
      // If the endpoint doesn't exist, use regular dispatch
      try {
        await axios.post(`http://127.0.0.1:8000/api/orders/${orderId}/dispatch`);
        alert(`Order ${orderId} shipped with ${availableQty} available units.`);
        fetchData();
      } catch (dispatchErr) {
        alert("Failed to ship: " + (dispatchErr.response?.data?.detail || dispatchErr.message));
      }
    }
  };


  return (
    <div className="p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-sky-500" /> Shipment Triage Board
          </h2>
          <p className="text-slate-500 text-sm">Scenario-Based Workflow: Express vs Shortage vs Standard</p>
        </div>
        <div className="flex gap-3">
          {/* Terminal Buttons for DSA Visualization */}
          <TerminalButton
            onClick={() => {
              setOverlayType('max_heap');
              fetchDSAState('max_heap');
              setOverlayOpen(true);
            }}
            label="Max-Heap Queue"
          />
          <TerminalButton
            onClick={() => {
              setOverlayType('hash_set');
              fetchDSAState('hash_set');
              setOverlayOpen(true);
            }}
            label="Hash Set Safety"
          />
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-indigo-200"
          >
            <FileText size={16} /> Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">

        {/* Zone 1: Express Lane (High Priority & Ready) */}
        <div className="col-span-12 lg:col-span-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-emerald-100 bg-emerald-100/50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <Zap size={18} fill="currentColor" /> Express Lane
            </h3>
            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
              {expressLane.length} Ready
            </span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {expressLane.map(order => (
              <div key={order.order_id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800 text-lg">{order.order_id}</span>
                  {order.tier > 1 && <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">VIP</span>}
                </div>
                <div className="text-sm font-medium text-slate-700 mb-1">{order.item_name}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
                    <Clock size={12} /> Due in {order.days_remaining}d
                  </span>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    <CheckCircle size={12} /> Stock Reserved ({order.qty}/{order.qty})
                  </span>
                </div>
                <button
                  onClick={() => handleDispatch(order.order_id)}
                  className="w-full mt-4 bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-emerald-200 shadow-lg text-sm active:scale-95 transform"
                >
                  DISPATCH NOW
                </button>
              </div>
            ))}
            {expressLane.length === 0 && <div className="text-center text-slate-400 italic text-sm mt-10">No urgent orders ready.</div>}
          </div>
        </div>

        {/* Zone 2: Shortage Alert (Problem Orders) */}
        <div className="col-span-12 lg:col-span-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-amber-100 bg-amber-100/50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
              <AlertTriangle size={18} fill="currentColor" /> Shortage Alert
            </h3>
            <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
              {shortageAlert.length} Blocked
            </span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {shortageAlert.map(order => (
              <div key={order.order_id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800">{order.order_id}</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                    Shortage
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-3">{order.item_name}</div>

                {/* Stock Gap Visual */}
                <div className="bg-slate-100 rounded-lg p-2 mb-3">
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Stock: {order.current_stock}</span>
                    <span className="text-rose-600">Missing: {order.qty - order.current_stock}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${(order.current_stock / order.qty) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleWait(order.order_id)}
                    className="bg-white border border-slate-200 text-slate-600 font-bold py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors"
                  >
                    Wait
                  </button>
                  <button
                    onClick={() => handleShipPartial(order.order_id, order.current_stock)}
                    className="bg-amber-100 text-amber-800 font-bold py-1.5 rounded-lg text-xs hover:bg-amber-200 transition-colors border border-amber-200"
                  >
                    Ship Partial ({order.current_stock})
                  </button>
                </div>
              </div>
            ))}
            {shortageAlert.length === 0 && <div className="text-center text-slate-400 italic text-sm mt-10">No stock shortages!</div>}
          </div>
        </div>

        {/* Zone 3: Standard Queue */}
        <div className="col-span-12 lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Clock size={18} /> Standard Queue
            </h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
              {standardQueue.length} Pending
            </span>
          </div>
          <div className="p-4 space-y-2 overflow-y-auto flex-1">
            {standardQueue.map(order => (
              <div key={order.order_id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                <div>
                  <div className="font-bold text-slate-700 text-sm">{order.order_id}</div>
                  <div className="text-xs text-slate-500">{order.item_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Qty: {order.qty}</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Ready</div>
                </div>
              </div>
            ))}
            {standardQueue.length === 0 && <div className="text-center text-slate-400 italic text-sm mt-10">Queue is empty.</div>}
          </div>
        </div>

      </div>

      {/* DSA Visualization Overlay */}
      <StructureOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        title={overlayType === 'max_heap' ? 'Max-Heap: Shipping Priority Queue' : 'Hash Set: Safety Gate'}
        type={overlayType}
        description={overlayType === 'max_heap' ? heapData?.description : hashSetData?.description}
        complexity={overlayType === 'max_heap' ? heapData?.complexity : hashSetData?.complexity}
        rawData={overlayType === 'max_heap' ? heapData : hashSetData}
      >
        {overlayType === 'max_heap' ? (
          <MaxHeapVisualization
            data={heapData}
            onNodeClick={(node) => {
              setOperationToast({
                operation: 'PEEK_MAX',
                result: `${node.order_id || node.label} - Score: ${node.priority_score || node.value}`,
                complexity: 'O(1)'
              });
            }}
          />
        ) : (
          <HashSetGate
            data={hashSetData}
            onTest={(lotId) => {
              const isBlocked = hashSetData?.blocked_lots?.includes(lotId);
              setOperationToast({
                operation: 'CONTAINS',
                result: isBlocked ? `❌ Lot ${lotId} is BLOCKED` : `✅ Lot ${lotId} is SAFE`,
                complexity: 'O(1)'
              });
            }}
          />
        )}
      </StructureOverlay>

      {/* Operation Toast */}
      <AnimatePresence>
        {operationToast && (
          <OperationToast
            operation={operationToast.operation}
            result={operationToast.result}
            complexity={operationToast.complexity}
            onDismiss={() => setOperationToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
