import React, { useState } from 'react';
import { Edit2, Trash2, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import axios from 'axios';

export function InventoryTable({ data, onUpdate }) {
  const [editingSku, setEditingSku] = useState(null);
  const [editVal, setEditVal] = useState(0);

  const handleDelete = async (sku) => {
    if (!confirm('Are you confirm you want to remove item ' + sku + '?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${sku}`);
      onUpdate();
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const startEdit = (item) => {
    setEditingSku(item.sku);
    setEditVal(item.current_stock || 0);
  };

  const saveEdit = async (sku) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${sku}/stock`, { sku, new_stock: editVal });
      setEditingSku(null);
      onUpdate();
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 shadow-sm bg-white">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <th className="py-4 px-6">Product Item</th>
            <th className="py-4 px-6">SKU ID</th>
            <th className="py-4 px-6">Stock Level</th>
            <th className="py-4 px-6">Stability Score</th>
            <th className="py-4 px-6 text-right">Settings</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item, idx) => {
            const stockPercent = Math.min(100, (item.stock_hint / 200) * 100); // Visual sim
            return (
              <tr key={item.sku} className={`group transition-all hover:bg-sky-50/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {item.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-mono text-xs text-slate-400">{item.sku}</td>

                <td className="py-4 px-6">
                  {editingSku === item.sku ? (
                    <div className="flex items-center gap-1 bg-white border border-sky-300 rounded-lg p-1 shadow-sm">
                      <button onClick={() => setEditVal(Math.max(0, editVal - 1))} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={14} /></button>
                      <input
                        type="number"
                        className="w-12 text-center text-slate-800 font-bold border-none focus:ring-0 p-0 text-sm"
                        value={editVal}
                        onChange={(e) => setEditVal(parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => setEditVal(editVal + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus size={14} /></button>
                      <button onClick={() => saveEdit(item.sku)} className="ml-2 bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm hover:bg-sky-600 transition-colors">SAVE</button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 w-24 group-hover:cursor-pointer" onClick={() => startEdit(item)} title="Click to edit">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">{item.stock_hint ?? "-"}</span>
                        <span className="text-slate-400 text-[10px]">/ 200</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${stockPercent}%` }}></div>
                      </div>
                    </div>
                  )}
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.days_remaining < 7 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      {item.days_remaining < 7 ? 'Critical' : 'Healthy'}
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {item.days_remaining.toFixed(1)} Days
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.sku)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
