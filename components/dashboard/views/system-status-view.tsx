'use client';

import { EnvironmentalMetrics, Worker } from '@/lib/types';
import { Thermometer, Wind, Radio, Signal, Zap, Cpu, Terminal } from 'lucide-react';
import { WorkerManager } from '../worker-manager';

// ✅ Added 'rawLogs' to the interface to fix Error #2322
interface SystemStatusViewProps {
  metrics: EnvironmentalMetrics;
  workers: Worker[];
  rawLogs: string[]; 
}

export function SystemStatusView({ metrics, workers, rawLogs }: SystemStatusViewProps) {
  const getStatusBadge = (value: number, thresholds: { safe: number; warning: number }) => {
    if (value >= thresholds.warning) return { color: 'bg-red-600 text-white', text: 'CRITICAL' };
    if (value >= thresholds.safe) return { color: 'bg-orange-500 text-white', text: 'WARNING' };
    return { color: 'bg-green-500 text-white', text: 'NOMINAL' };
  };

  const tempStatus = getStatusBadge(metrics.avgTemperature, { safe: 40, warning: 45 });
  const gasStatus = getStatusBadge(metrics.maxGasLevel, { safe: 500, warning: 700 });
  const avgSignal = Math.round(workers.reduce((sum, w) => sum + w.rssi, 0) / (workers.length || 1));

  const getSignalQuality = (rssi: number) => {
    if (rssi > -50) return { text: 'Excellent', color: 'text-green-500' };
    if (rssi > -70) return { text: 'Stable', color: 'text-blue-500' };
    return { text: 'Weak', color: 'text-red-500' };
  };

  return (
    <div className="w-full p-8 space-y-12 bg-slate-50/30">
      
      {/* SECTION HEADER */}
      <div className="flex items-end justify-between border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Network & Infrastructure</h2>
          <p className="text-xs font-bold text-purple-600 mt-2 uppercase tracking-widest italic">Hardware Health & Database Management</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Gateway v2.4</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Monitor */}
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Thermal Grid</h3>
            </div>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${tempStatus.color}`}>{tempStatus.text}</span>
          </div>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-6xl font-black text-slate-900 tracking-tighter">{metrics.avgTemperature.toFixed(1)}°</p>
          </div>
        </div>

        {/* Gas Monitor */}
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Wind className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Gas Detection</h3>
            </div>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${gasStatus.color}`}>{gasStatus.text}</span>
          </div>
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-6xl font-black text-slate-900 tracking-tighter">{metrics.maxGasLevel}</p>
          </div>
        </div>
      </div>

      {/* ✅ ADDED: LIVE DATA PACKET TERMINAL */}
      <div className="bg-slate-900 rounded-[2rem] border-4 border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-800 px-6 py-3 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Gateway Debugger</span>
          </div>
          <div className="flex gap-1.5">
             <div className="w-2 h-2 rounded-full bg-red-500/50" />
             <div className="w-2 h-2 rounded-full bg-amber-500/50" />
             <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="h-48 p-5 font-mono text-[10px] text-green-400 overflow-y-auto space-y-1 bg-black/40">
          {rawLogs.length === 0 ? (
            <p className="text-slate-600 italic animate-pulse">[ Awaiting LoRa incoming packets... ]</p>
          ) : (
            rawLogs.map((log, i) => (
              <div key={i} className="flex gap-4 border-l border-green-900/30 pl-3">
                <span className="text-green-900 shrink-0">0{i+1}</span>
                <span className="break-all">{log}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* NODE MANAGEMENT */}
      <div className="pt-8 border-t-4 border-slate-900">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="w-8 h-8 text-purple-600" />
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Node Database Management</h3>
        </div>
        <WorkerManager workers={workers} />
      </div>
    </div>
  );
}