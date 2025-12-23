import React, { useState } from 'react';
import axios from 'axios';

export function AddProductForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    current_stock: 0,
    lead_time_days: 7,
    unit_cost: 0.0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/products', formData);
      onSuccess();
    } catch (e) {
      alert('Error creating product: ' + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">SKU</label>
        <input
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
          placeholder="e.g. SKU999"
          value={formData.sku}
          onChange={e => setFormData({ ...formData, sku: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Product Name</label>
        <input
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
          placeholder="e.g. Wireless Mouse"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Initial Stock</label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
            value={formData.current_stock}
            onChange={e => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Lead Time (Days)</label>
          <input
            type="number"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
            value={formData.lead_time_days}
            onChange={e => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Unit Cost ($)</label>
        <input
          type="number"
          step="0.01"
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
          value={formData.unit_cost}
          onChange={e => setFormData({ ...formData, unit_cost: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-medium">
          Cancel
        </button>
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 text-sm font-medium">
          Create Product
        </button>
      </div>
    </form>
  );
}
