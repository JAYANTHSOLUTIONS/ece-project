'use client';

import { SystemEvent } from '@/lib/types';
import { AlertTriangle, AlertCircle, Info, Filter, Clock, Activity } from 'lucide-react';
import { useState } from 'react';

interface AlertsViewProps {
  events: SystemEvent[];
}

export function AlertsView({ events }: AlertsViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredEvents = events.filter((e) => filterSeverity === 'all' || e.severity === filterSeverity);

  const getEventStyle = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          badge: 'bg-red-600 text-white',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-500',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          badge: 'bg-orange-500 text-white',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          icon: Info,
          iconColor: 'text-purple-600',
          badge: 'bg-slate-800 text-white',
        };
    }
  };

  const severityStats = {
    critical: events.filter((e) => e.severity === 'critical').length,
    warning: events.filter((e) => e.severity === 'warning').length,
    info: events.filter((e) => e.severity === 'info').length,
  };

  return (
    /* ✅ FIXED: Removed lg:ml-64 and added w-full p-8. Now sits flush with sidebar. */
    <div className="w-full p-8 space-y-10">
      
      {/* INDUSTRIAL HEADER */}
      <div className="flex items-end justify-between border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            System Event Log
          </h2>
          <p className="text-xs font-bold text-purple-600 mt-2 uppercase tracking-widest italic">
            Centralized Safety Monitoring Hub
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{events.length} TOTAL LOGS</span>
           </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: 'all', label: 'Global Feed', count: events.length, color: 'border-slate-200 text-slate-900' },
          { id: 'critical', label: 'Critical Alerts', count: severityStats.critical, color: 'border-red-500 text-red-600 bg-red-50' },
          { id: 'warning', label: 'Risk Warnings', count: severityStats.warning, color: 'border-orange-500 text-orange-600 bg-orange-50' },
          { id: 'info', label: 'System Info', count: severityStats.info, color: 'border-purple-500 text-purple-600 bg-purple-50' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterSeverity(f.id as any)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 shadow-sm ${
              filterSeverity === f.id ? f.color + ' ring-4 ring-purple-100' : 'bg-white border-slate-100 text-slate-400 hover:border-purple-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-tighter">{f.label}</span>
            <span className="text-2xl font-black">{f.count}</span>
          </button>
        ))}
      </div>

      {/* TIMELINE FEED */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const style = getEventStyle(event.severity);
            const IconComponent = style.icon;

            return (
              <div
                key={index}
                className={`${style.bg} border-l-8 ${style.border} rounded-2xl p-6 transition-all shadow-sm flex items-center gap-6`}
              >
                {/* Visual Indicator */}
                <div className={`p-4 rounded-2xl bg-white shadow-inner ${style.iconColor}`}>
                   <IconComponent className="w-6 h-6" />
                </div>

                {/* Event Message - WIDE LAYOUT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${style.badge}`}>
                      {event.severity}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    {event.message}
                  </h4>
                  <div className="mt-2 flex items-center gap-4">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Origin: <span className="text-purple-600">{event.workerName || 'LoRa Gateway'}</span>
                     </span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                       ID: {event.workerId || 'Hub-01'}
                     </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[3rem] p-24 text-center">
            <Info className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm">
              Clear Skies: No {filterSeverity === 'all' ? '' : filterSeverity} events recorded
            </p>
          </div>
        )}
      </div>
    </div>
  );
}