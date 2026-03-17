'use client';

import { Worker, EnvironmentalMetrics, SystemEvent } from '@/lib/types';
import { AlertTriangle, Heart, Thermometer, Wind, Users, Zap, TrendingUp } from 'lucide-react';

interface OverviewViewProps {
  workers: Worker[];
  metrics: EnvironmentalMetrics;
  events: SystemEvent[];
}

export function OverviewView({ workers, metrics, events }: OverviewViewProps) {
  const criticalWorkers = workers.filter(
    (w) =>
      w.gasLevel > 700 ||
      w.temperature > 45 ||
      w.helmetStatus === 'N' ||
      w.beltStatus === 'U'
  );

  const recentCriticalEvents = events
    .filter((e) => e.severity === 'critical')
    .slice(0, 5);

  const getStatusColor = (value: number, thresholds: { safe: number; warning: number }) => {
    if (value >= thresholds.warning) return 'text-red-600 bg-red-100';
    if (value >= thresholds.safe) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    /* ✅ FIXED: Removed lg:ml-64 and added w-full p-8. 
       This ensures the page starts exactly where the sidebar ends. */
    <div className="w-full p-8 space-y-10">
      
      {/* KPI Section Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
          Mine Operations Overview
        </h2>
        <p className="text-xs font-bold text-purple-600 mt-1 uppercase tracking-widest italic">
          Aggregate Real-time Metrics
        </p>
      </div>

      {/* KPI Cards - Stretches to fill the wider space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Workers */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 text-purple-600" />
            <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full">ACTIVE</span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Personnel</h3>
          <p className="text-4xl font-black text-slate-900 mt-1">{workers.length}</p>
          <div className="h-1 w-full bg-slate-100 rounded-full mt-4">
             <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Avg Temperature */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-10 h-10 text-orange-500" />
            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${getStatusColor(metrics.avgTemperature, { safe: 40, warning: 45 })}`}>
              {metrics.avgTemperature > 45 ? 'CRITICAL' : 'SAFE'}
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Avg Temp</h3>
          <p className="text-4xl font-black text-slate-900 mt-1">{metrics.avgTemperature.toFixed(1)}°C</p>
          <div className="h-1 w-full bg-slate-100 rounded-full mt-4">
             <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(metrics.avgTemperature/60)*100}%` }} />
          </div>
        </div>

        {/* Max Gas Level */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-10 h-10 text-blue-500" />
            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${getStatusColor(metrics.maxGasLevel, { safe: 500, warning: 700 })}`}>
              {metrics.maxGasLevel > 700 ? 'DANGER' : 'SAFE'}
            </span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Max Gas</h3>
          <p className="text-4xl font-black text-slate-900 mt-1">{metrics.maxGasLevel} <span className="text-sm">PPM</span></p>
          <div className="h-1 w-full bg-slate-100 rounded-full mt-4">
             <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(metrics.maxGasLevel/1000)*100}%` }} />
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-10 h-10 text-green-600" />
            <span className="text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full">UPTIME</span>
          </div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Status</h3>
          <p className="text-2xl font-black text-slate-900 mt-1 font-mono uppercase truncate">{metrics.systemUptime}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">LoRa Link Stable</p>
        </div>
      </div>

      {/* Critical Alerts & Recent Events - 2 Wide Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Workers */}
        <div className="bg-white border-2 border-red-100 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Active Violations</h3>
            </div>
            <span className="text-lg font-black text-red-600 bg-red-50 px-4 py-1 rounded-xl">
              {criticalWorkers.length}
            </span>
          </div>

          {criticalWorkers.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {criticalWorkers.map((worker) => {
                const violations = [];
                if (worker.helmetStatus === 'N') violations.push('Helmet Removed');
                if (worker.beltStatus === 'U') violations.push('Belt Unlocked');
                if (worker.gasLevel > 700) violations.push('Lethal Gas');
                if (worker.temperature > 45) violations.push('Thermal Stress');

                return (
                  <div key={worker.id} className="p-5 bg-red-50 border-2 border-red-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">{worker.name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {violations.map((v) => (
                          <span key={v} className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-tighter">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {worker.id.slice(-4)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Zap className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-black text-slate-400 uppercase tracking-widest text-xs">All units in compliance</p>
            </div>
          )}
        </div>

        {/* Recent Critical Events */}
        <div className="bg-white border-2 border-purple-100 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-purple-600" />
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Critical Event Log</h3>
            </div>
            <span className="text-lg font-black text-purple-600 bg-purple-50 px-4 py-1 rounded-xl">
              {recentCriticalEvents.length}
            </span>
          </div>

          {recentCriticalEvents.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {recentCriticalEvents.map((event, i) => (
                <div key={i} className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight">{event.message}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No recent safety incidents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}