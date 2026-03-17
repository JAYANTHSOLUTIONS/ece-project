'use client';

import { EnvironmentalMetrics, Worker } from '@/lib/types';
import { Thermometer, Wind, Radio, Signal, Zap, Activity, Cpu } from 'lucide-react';
import { WorkerManager } from '../worker-manager'; // ✅ Import the new SQLite Manager

interface SystemStatusViewProps {
  metrics: EnvironmentalMetrics;
  workers: Worker[];
}

export function SystemStatusView({ metrics, workers }: SystemStatusViewProps) {
  const getStatusBadge = (value: number, thresholds: { safe: number; warning: number }) => {
    if (value >= thresholds.warning) {
      return { color: 'bg-red-600 text-white', text: 'CRITICAL' };
    }
    if (value >= thresholds.safe) {
      return { color: 'bg-orange-500 text-white', text: 'WARNING' };
    }
    return { color: 'bg-green-500 text-white', text: 'NOMINAL' };
  };

  const tempStatus = getStatusBadge(metrics.avgTemperature, { safe: 40, warning: 45 });
  const gasStatus = getStatusBadge(metrics.maxGasLevel, { safe: 500, warning: 700 });

  const avgSignal = Math.round(
    workers.reduce((sum, w) => sum + w.rssi, 0) / (workers.length || 1)
  );

  const getSignalQuality = (rssi: number) => {
    if (rssi > -50) return { text: 'Excellent', color: 'text-green-500' };
    if (rssi > -70) return { text: 'Stable', color: 'text-blue-500' };
    if (rssi > -85) return { text: 'Weak', color: 'text-orange-500' };
    return { text: 'Critical', color: 'text-red-500' };
  };

  return (
    /* ✅ FIXED: Page is now flush with the sidebar (No lg:ml-64) */
    <div className="w-full p-8 space-y-12 bg-slate-50/30">
      
      {/* SECTION HEADER */}
      <div className="flex items-end justify-between border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Network & Infrastructure
          </h2>
          <p className="text-xs font-bold text-purple-600 mt-2 uppercase tracking-widest italic">
            Hardware Health & Database Management
          </p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Gateway v2.4</span>
        </div>
      </div>

      {/* 1. ENVIRONMENTAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Monitor */}
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Thermal Grid</h3>
            </div>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${tempStatus.color}`}>
              {tempStatus.text}
            </span>
          </div>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-6xl font-black text-slate-900 tracking-tighter">{metrics.avgTemperature.toFixed(1)}°</p>
            <span className="text-slate-400 font-bold uppercase text-xs italic">Avg Ambient</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="text-center border-r border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Min</p><p className="font-black">{Math.min(...workers.map(w => w.temperature)).toFixed(1)}°</p></div>
             <div className="text-center border-r border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Max</p><p className="font-black">{Math.max(...workers.map(w => w.temperature)).toFixed(1)}°</p></div>
             <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Limit</p><p className="font-black text-green-600">40.0°</p></div>
          </div>
        </div>

        {/* Gas Monitor */}
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Wind className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Gas Detection</h3>
            </div>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${gasStatus.color}`}>
              {gasStatus.text}
            </span>
          </div>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-6xl font-black text-slate-900 tracking-tighter">{metrics.maxGasLevel}</p>
            <span className="text-slate-400 font-bold uppercase text-xs italic">Max PPM (MQ-9)</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="text-center border-r border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Avg</p><p className="font-black">{Math.round(workers.reduce((s,w) => s+w.gasLevel,0)/workers.length)}</p></div>
             <div className="text-center border-r border-slate-200"><p className="text-[10px] font-bold text-slate-400 uppercase">Peak</p><p className="font-black">{metrics.maxGasLevel}</p></div>
             <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Safety</p><p className="font-black text-green-600">500</p></div>
          </div>
        </div>
      </div>

      {/* 2. NETWORK & LORA STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-purple-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Radio className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Gateway Feed</h3>
          </div>
          <div className="p-6 bg-green-50 rounded-3xl border-2 border-green-100 flex justify-between items-center mb-6">
             <div><p className="font-black text-slate-900">Uplink Stable</p><p className="text-[10px] font-bold text-slate-500 uppercase">Cloud Handshake Verified</p></div>
             <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Freq</p><p className="font-black">433.0 MHz</p></div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Factor</p><p className="font-black">SF 12</p></div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Signal className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mesh Quality</h3>
          </div>
          <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex justify-between items-end mb-6">
             <div><p className="text-[10px] font-black text-slate-400 uppercase">Avg RSSI</p><p className="text-4xl font-black font-mono">{avgSignal} dBm</p></div>
             <span className={`text-lg font-black uppercase italic ${getSignalQuality(avgSignal).color}`}>{getSignalQuality(avgSignal).text}</span>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase"><span>Strength Distribution</span><span>{workers.length} Nodes</span></div>
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: '60%' }} />
                <div className="h-full bg-blue-500" style={{ width: '30%' }} />
                <div className="h-full bg-orange-500" style={{ width: '10%' }} />
             </div>
          </div>
        </div>
      </div>

      {/* 3. ✅ SQLITE DATABASE & NODE MANAGEMENT */}
      <div className="pt-8 border-t-4 border-slate-900">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Node Database Management</h3>
        </div>
        <WorkerManager workers={workers} />
      </div>

      {/* 4. SYSTEM INFO STRIP */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Uptime</p>
            <p className="text-lg font-black font-mono text-purple-400 truncate">{metrics.systemUptime}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Telemetry Rate</p>
            <p className="text-3xl font-black">{workers.length * 7}<span className="text-xs ml-1 opacity-40">p/s</span></p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Database Index</p>
            <p className="text-3xl font-black">{workers.length}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sync Cycle</p>
            <p className="text-3xl font-black">3000<span className="text-xs ml-1 opacity-40">ms</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}