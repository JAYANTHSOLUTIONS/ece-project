'use client';

import React from 'react';
import { Worker } from '@/lib/types';
import { 
  Heart, 
  Thermometer, 
  Wind, 
  Battery, 
  Lock, 
  Unlock, 
  HardHat, 
  AlertOctagon, 
  Signal,
  Activity
} from 'lucide-react';

export const WorkerCard = React.memo(function WorkerCard({ worker }: { worker: Worker }) {
  // Mapping to your image data: B:U (Unlocked) and H:N (No Helmet)
  const isHelmetOff = worker.helmetStatus === 'N';
  const isBeltUnlocked = worker.beltStatus === 'U';
  const isGasCritical = worker.gasLevel > 700;
  const isCritical = isHelmetOff || isBeltUnlocked || isGasCritical;

  return (
    <div className={`w-full rounded-[2rem] border-2 transition-all duration-300 shadow-xl bg-white overflow-hidden ${
      isCritical ? 'border-red-500 ring-8 ring-red-50/50' : 'border-slate-100 hover:border-purple-200'
    }`}>

      {/* COMPACT TOP BAR - NODE IDENTIFIER */}
      <div className={`px-6 py-2 flex justify-between items-center ${isCritical ? 'bg-red-600' : 'bg-slate-900'}`}>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-white opacity-70" />
          <span className="text-[10px] font-black text-white tracking-widest uppercase">
            LoRa Node: {worker.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-white animate-pulse' : 'bg-green-400'}`} />
          <span className="text-[10px] font-bold text-white uppercase italic tracking-widest">
            {isCritical ? 'Safety Breach' : 'Link Active'}
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* NAME SECTION - Full Width */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
          <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none capitalize">
              {worker.name}
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                Ops Unit 04
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                Mining Zone Alpha
              </span>
            </div>
          </div>
          {isCritical && <AlertOctagon className="w-10 h-10 text-red-600 animate-bounce" />}
        </div>

        {/* TELEMETRY GRID - Directly mapping to your image keys (HR, G, T, RSSI) */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* HR: Heart Rate */}
          <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <Heart className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-2xl font-black text-slate-800 font-mono leading-none">{worker.heartRate}</p>
            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">HR (BPM)</span>
          </div>

          {/* G: Gas Level */}
          <div className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center ${isGasCritical ? 'bg-red-100 border-red-200' : 'bg-slate-50/50 border-slate-100'}`}>
            <Wind className={`w-5 h-5 mb-2 ${isGasCritical ? 'text-red-600' : 'text-blue-500'}`} />
            <p className={`text-2xl font-black font-mono leading-none ${isGasCritical ? 'text-red-700' : 'text-slate-800'}`}>{worker.gasLevel}</p>
            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">G (PPM)</span>
          </div>

          {/* T: Temperature */}
          <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <Thermometer className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-2xl font-black text-slate-800 font-mono">{worker.temperature.toFixed(1)}°</p>
            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">T (Temp)</span>
          </div>

          {/* RSSI: Signal Strength */}
          <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <Signal className="w-5 h-5 text-indigo-500 mb-2" />
            <p className="text-2xl font-black text-slate-800 font-mono">{worker.rssi}</p>
            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">RSSI (dBm)</span>
          </div>
        </div>

        {/* SAFETY COMPLIANCE - Mapping H:N and B:U */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
            isHelmetOff ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600'
          }`}>
            <div className="flex items-center gap-4">
              <HardHat className="w-8 h-8" />
              <span className="text-sm font-black uppercase tracking-widest">Helmet (H)</span>
            </div>
            <span className="text-xs font-black px-3 py-1 bg-white/20 rounded-lg">
              {isHelmetOff ? 'REMOVED' : 'DETECTED'}
            </span>
          </div>

          <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
            isBeltUnlocked ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600'
          }`}>
            <div className="flex items-center gap-4">
              {isBeltUnlocked ? <Unlock className="w-8 h-8"/> : <Lock className="w-8 h-8"/>}
              <span className="text-sm font-black uppercase tracking-widest">Belt (B)</span>
            </div>
            <span className="text-xs font-black px-3 py-1 bg-white/20 rounded-lg">
              {isBeltUnlocked ? 'OPEN' : 'LOCKED'}
            </span>
          </div>
        </div>
      </div>

      {/* BATTERY FOOTER - Mapping BAT:0 */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Battery className={`w-6 h-6 ${worker.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-600'}`} />
           <span className="text-sm font-black text-slate-700">BAT: {worker.battery}%</span>
        </div>
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ${worker.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${worker.battery}%` }}
          />
        </div>
      </div>
    </div>
  );
});