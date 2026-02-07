import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

export function AddOrderForm({ onSuccess, onCancel }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    customer_tier: 1,
    sku: '',
    qty_requested: 1
  });

  useEffect(() => {
    // Fetch products for dropdown using the inventory endpoint
    axios.get('http://127.0.0.1:8000/api/inventory/stability')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
          // Set default SKU if available
          if (res.data.length > 0) {
            setFormData(prev => ({ ...prev, sku: res.data[0].sku }));
          }
        }
      })
      .catch(err => console.error("Failed to load products", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/orders', formData);
      onSuccess();
    } catch (e) {
      alert('Error creating order: ' + (e.response?.data?.detail || e.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Customer Name</label>
        <input
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
          placeholder="e.g. Acme Corp"
          value={formData.customer}
          onChange={e => setFormData({ ...formData, customer: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Customer Tier</label>
        <select
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2 bg-white"
          value={formData.customer_tier}
          onChange={e => setFormData({ ...formData, customer_tier: parseInt(e.target.value) })}
        >
          <option value={1}>Standard (Base Priority)</option>
          <option value={2}>VIP (+50 Priority)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Product (SKU)</label>
        <select
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2 bg-white"
          value={formData.sku}
          onChange={e => setFormData({ ...formData, sku: e.target.value })}
        >
          {products.map(p => (
            <option key={p.sku} value={p.sku}>
              {p.name} ({p.sku}) - Stock: {p.stock_hint || 'N/A'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Quantity</label>
        <input
          type="number"
          min="1"
          required
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm border p-2"
          value={formData.qty_requested}
          onChange={e => setFormData({ ...formData, qty_requested: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-medium">
          Cancel
        </button>
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 text-sm font-medium">
          Create Order
        </button>
      </div>
    </form>
  );
}
