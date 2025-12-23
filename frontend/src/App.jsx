import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { Card } from './components/Card';
import { AlertCircle, CheckCircle2, TrendingUp, Package, RefreshCw, ShoppingCart } from 'lucide-react';

// Configure Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

function App() {
  const [summary, setSummary] = useState(null);
  const [priority, setPriority] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sumRes, priRes, invRes, audRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/priority/top'),
        api.get('/inventory/stability'),
        api.get('/audit/next')
      ]);

      setSummary(sumRes.data);
      setPriority(priRes.data);
      setInventory(invRes.data);
      setAudit(audRes.data.audit_sequence);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading PIRS...</div>;

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Real-time inventory intelligence</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
            <RefreshCw size={16} />
            Sync Now
          </button>
        </header>

        {/* --- Top Row: Priority Alert & KPIs --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Priority Alert (Hero) */}
          <div className="md:col-span-2 relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${priority?.days_remaining < 7 ? 'bg-rose-500' : 'bg-emerald-500'}`} />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${priority?.days_remaining < 7 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                  {priority?.days_remaining < 7 ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                  {priority?.days_remaining < 7 ? 'Urgent Reorder Action' : 'System Healthy'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{priority?.name || "Unknown Product"}</h2>
              <p className="text-slate-500">Predicted Stockout: <strong className="text-slate-700">{Math.round(priority?.days_remaining)} Days Remaining</strong></p>
            </div>

            <div className="text-right">
              <span className="block text-sm text-slate-400 uppercase tracking-wider font-medium mb-1">Current Stock</span>
              <span className="text-4xl font-bold text-slate-900">{priority?.current_stock}</span>
              <span className="block text-xs text-slate-400 mt-1">Lead Time: {priority?.lead_time} days</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="flex-row items-center gap-4 py-5" title={null} action={null}>
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Products</p>
                <p className="text-2xl font-bold text-slate-900">{summary?.total_sku_count}</p>
              </div>
            </Card>
            <Card className="flex-row items-center gap-4 py-5" title={null} action={null}>
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Critical Alerts</p>
                <p className="text-2xl font-bold text-slate-900">{summary?.critical_stock_alert}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* --- Middle Row: Inventory Table --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Inventory Stability (BST Sorted)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Stability (Days)</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inventory.map((item, idx) => (
                      <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.sku}</td>
                        <td className="py-3 px-4 text-slate-700 font-mono">{item.days_remaining.toFixed(1)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.days_remaining < 7 ? 'bg-rose-500' : item.days_remaining < 30 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                          <span className={item.days_remaining < 7 ? 'text-rose-600 font-medium' : 'text-slate-500'}>
                            {item.days_remaining < 7 ? 'Critial' : 'Stable'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Col: Audit & Actions */}
          <div className="space-y-6">
            {/* Audit Widget (Circular List) */}
            <Card title="Audit Rotation">
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {audit.slice(0, 3).map((sku, i) => (
                  <div key={i} className="relative">
                    <span className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 border-white box-content ${i === 0 ? 'bg-sky-500 ring-4 ring-sky-100' : 'bg-slate-200'}`}></span>
                    <p className={`text-sm ${i === 0 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>Audit Shelf: {sku}</p>
                    {i === 0 && <p className="text-xs text-sky-600 mt-1 font-medium">Pending Inspection</p>}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium py-2 rounded-lg transition-colors border border-slate-200">
                Mark Current as Done
              </button>
            </Card>

            {/* Quick Actions (Simulation) */}
            <Card title="Simulator">
              <button className="w-full mb-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <ShoppingCart size={16} />
                Simulate New Order
              </button>
              <p className="text-xs text-slate-400 text-center">Triggers Queue & Safety Check</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
