import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Truck, BarChart3, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Navbar({ activeTab, onTabChange }) {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'inventory', label: t('inventory'), icon: Package },
    { id: 'orders', label: t('orders'), icon: ShoppingCart },
    { id: 'shipments', label: t('shipments'), icon: Truck },
  ];

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'kn', label: 'ಕನ್ನಡ', short: 'KN' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Saaman Logo" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Saaman</h1>
              <p className="text-xs text-slate-500">Inventory Management</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-100 text-sky-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                   {lang.label} ({lang.short})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
