import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, title, action }) {
  return (
    <div className={twMerge("bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col", className)}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
