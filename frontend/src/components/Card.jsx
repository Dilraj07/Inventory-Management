import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ title, action, children, className }) {
  return (
    <div className={twMerge("bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-12px_rgba(14,165,233,0.15)] transition-all duration-300 p-6 backdrop-blur-sm", className)}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50/50">
          {title && <h3 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h3>}
          {action && <div className="text-sm">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
