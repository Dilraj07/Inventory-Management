import React, { useState, useEffect } from 'react';
import { Search, Edit2, CheckCircle2, AlertCircle, Clock, ArrowUpDown, Layers } from 'lucide-react';
import axios from 'axios';

export function OrdersTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showHeapInfo, setShowHeapInfo] = useState(false);

  // Calculate priority score for display (matching backend logic)
  const calculatePriorityScore = (order) => {
    let score = 0;
    const tier = order.customer_tier || 1;
    const daysRemaining = order.days_remaining || 30;

    // VIP bonus
    if (tier === 2) {
      score += 50;
    }

    // Urgency based on days remaining
    score += (100 - daysRemaining);

    return Math.max(1, score);
  };

  // Sort data by priority score (Max-Heap order: highest first)
  const sortedData = [...data].map(order => ({
    ...order,
    priority_score: calculatePriorityScore(order)
  })).sort((a, b) => b.priority_score - a.priority_score);

  // Filter logic
  const filteredData = sortedData.filter(order => {
    const matchesSearch =
      (order.order_id && order.order_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.sku && order.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'SHIPPED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'BLOCKED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  // Simplified: Only Standard and VIP
  const getTierLabel = (tier) => {
    switch (tier) {
      case 2: return 'VIP';
      default: return 'STD';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 2: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] bg-white">
      {/* Max-Heap Info Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-600" size={18} />
          <h3 className="text-sm font-bold text-slate-700">Order Queue (Max-Heap Priority)</h3>
          <span className="ml-auto text-xs bg-white/80 px-3 py-1 rounded-full border border-slate-200 text-slate-500">
            Sorted by Priority Score (Highest First)
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-600">
          <span className="font-semibold text-indigo-600">DSA Insight:</span> Orders are stored in a Max-Heap. VIP orders get +50 priority points. Higher score = Processed first.
        </div>
      </div>

      <div className="p-4 border-b border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Orders..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
            <th className="py-4 px-6 font-semibold w-20">
              <div className="flex items-center gap-1">
                <ArrowUpDown size={12} />
                Priority
              </div>
            </th>
            <th className="py-4 px-6 font-semibold w-32">Order ID</th>
            <th className="py-4 px-6 font-semibold w-24">Date</th>
            <th className="py-4 px-6 font-semibold">Product</th>
            <th className="py-4 px-6 font-semibold text-center w-20">Tier</th>
            <th className="py-4 px-6 font-semibold text-right w-24">Qty</th>
            <th className="py-4 px-6 font-semibold text-right w-32">Total Price</th>
            <th className="py-4 px-6 font-semibold w-32">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filteredData.map((order, idx) => (
            <tr key={order.order_id} className="hover:bg-slate-50/80 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${idx === 0 ? 'bg-indigo-100 text-indigo-700' :
                      idx < 3 ? 'bg-purple-50 text-purple-600' :
                        'bg-slate-100 text-slate-500'
                    }`}>
                    {order.priority_score}
                  </span>
                </div>
              </td>
              <td className="py-4 px-6 font-medium text-slate-900">{order.order_id}</td>
              <td className="py-4 px-6 text-slate-500 font-mono text-xs">{order.order_date}</td>
              <td className="py-4 px-6">
                <div className="font-medium text-slate-900">{order.product_name || order.sku}</div>
                <div className="text-xs text-slate-500">{order.sku}</div>
              </td>
              <td className="py-4 px-6 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getTierColor(order.customer_tier)}`}>
                  {getTierLabel(order.customer_tier)}
                </span>
              </td>
              <td className="py-4 px-6 text-slate-900 font-bold text-right">{order.qty_requested}</td>
              <td className="py-4 px-6 text-slate-900 font-bold text-right">
                ₹{order.total_amount?.toLocaleString('en-IN') || '0.00'}
              </td>
              <td className="py-4 px-6">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status === 'SHIPPED' && <CheckCircle2 size={12} />}
                  {order.status === 'PENDING' && <Clock size={12} />}
                  {order.status === 'BLOCKED' && <AlertCircle size={12} />}
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="8" className="py-8 text-center text-slate-400 italic">
                No orders found matching "{searchTerm}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

