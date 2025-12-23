import React from 'react';
import { LayoutDashboard, Truck, BarChart3, AlertTriangle, PackageSearch } from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: PackageSearch, label: 'Inventory' },
    { icon: Truck, label: 'Shipments' },
    { icon: BarChart3, label: 'Reports' },
    { icon: AlertTriangle, label: 'Alerts', badge: 1 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold">P</div>
        <span className="text-xl font-bold tracking-tight">PIRS System</span>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${item.active
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Warehouse Mgr</span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
