import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, HelpCircle, Truck } from 'lucide-react';

export function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'shipments', icon: Truck, label: 'Orders' }, // Mapped to Orders
    { id: 'reports', icon: BarChart3, label: 'Reporting' },
  ];

  return (
    <div className="fixed left-4 top-4 bottom-4 w-64 bg-[#f8fafc] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-50 overflow-hidden border border-slate-100 flex flex-col">

      {/* Header / Logo Area */}
      <div className="h-24 flex items-center shrink-0 pl-8">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        </div>
        <span className="ml-4 font-bold text-xl text-slate-800 tracking-tight">
          PIRS Core
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center h-14 rounded-[24px] transition-all relative group overflow-hidden ${isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100/50'
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
                }`}
            >
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} />
              </div>

              <span className={`text-base font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                {item.label}
              </span>

              {/* Active Indicator (Pill Shape) */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-slate-900 rounded-r-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 shrink-0 mb-2">
        <button className="w-full flex items-center h-14 rounded-[24px] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <LogOut size={22} />
          </div>
          <span className="text-sm font-bold">
            Logout
          </span>
        </button>
      </div>

    </div>
  );
}
