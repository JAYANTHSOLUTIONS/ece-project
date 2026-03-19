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
  Activity,
  Flame // Added for Gas Alert
} from 'lucide-react';

export const WorkerCard = React.memo(function WorkerCard({ worker }: { worker: Worker }) {
  const isNaresh = worker.name === 'Naresh G';

  // 🚨 ALERT LOGIC
  const isHelmetOff = worker.helmetStatus === 'N';
  const isBeltUnlocked = worker.beltStatus === 'U';
  const isGasCritical = worker.gasLevel > 700;
  const isTempHigh = worker.temperature > 38; // 👈 New: Temp Alert Threshold
  
  // Combined Critical State
  const isCritical = isHelmetOff || isBeltUnlocked || isGasCritical || isTempHigh;

  return (
    <div className={`w-full rounded-[2rem] border-2 transition-all duration-500 shadow-xl bg-white overflow-hidden relative ${
      isNaresh 
        ? (isCritical ? 'border-red-500 ring-8 ring-red-50/50' : 'border-slate-100 hover:border-purple-200')
        : 'grayscale opacity-40 border-slate-200 pointer-events-none'
    }`}>

      {/* TOP STATUS BAR */}
      <div className={`px-6 py-2 flex justify-between items-center ${
        !isNaresh ? 'bg-slate-400' : (isCritical ? 'bg-red-600' : 'bg-slate-900')
      }`}>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-white opacity-70" />
          <span className="text-[10px] font-black text-white tracking-widest uppercase">
            LoRa Node: {worker.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${!isNaresh ? 'bg-slate-300' : (isCritical ? 'bg-white animate-pulse' : 'bg-green-400')}`} />
          <span className="text-[10px] font-bold text-white uppercase italic tracking-widest">
            {!isNaresh ? 'OFFLINE / FIXED' : (isCritical ? 'SAFETY BREACH' : 'LINK ACTIVE')}
          </span>
        </div>
      </div>

      <div className="p-8">
        {/* NAME & HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
          <div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none capitalize">
              {worker.name}
            </h3>
            <div className="flex items-center gap-2 mt-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isNaresh ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                Ops Unit 04
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase italic">Mining Zone Alpha</span>
            </div>
          </div>
          {isNaresh && isCritical && <AlertOctagon className="w-10 h-10 text-red-600 animate-bounce" />}
        </div>

        {/* TELEMETRY GRID WITH NEW ALERTS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {/* Heart Rate */}
          <StatBox icon={<Heart className="w-5 h-5 text-red-500" />} value={worker.heartRate} label="HR (BPM)" />
          
          {/* Gas Level Alert */}
          <StatBox 
            icon={<Wind className={`w-5 h-5 ${isGasCritical && isNaresh ? 'text-white' : 'text-blue-500'}`} />} 
            value={worker.gasLevel} 
            label={isGasCritical && isNaresh ? "GAS LEAK!" : "G (PPM)"}
            critical={isGasCritical && isNaresh} 
          />
          
          {/* Temperature Alert */}
          <StatBox 
            icon={<Thermometer className={`w-5 h-5 ${isTempHigh && isNaresh ? 'text-white' : 'text-orange-500'}`} />} 
            value={worker.temperature.toFixed(1)} 
            label={isTempHigh && isNaresh ? "HIGH TEMP!" : "T (Temp)"}
            critical={isTempHigh && isNaresh} 
          />

          {/* Signal */}
          <StatBox icon={<Signal className="w-5 h-5 text-indigo-500" />} value={worker.rssi} label="RSSI (dBm)" />
        </div>

        {/* PPE SAFETY SECTION */}
        <div className="grid grid-cols-2 gap-4">
          <ComplianceBox 
            icon={<HardHat className="w-8 h-8" />} 
            label="Helmet" 
            statusText={isHelmetOff ? 'REMOVED' : 'SAFE'}
            active={!isHelmetOff} 
            isNaresh={isNaresh}
          />
          <ComplianceBox 
            icon={isBeltUnlocked ? <Unlock className="w-8 h-8"/> : <Lock className="w-8 h-8"/>} 
            label="Belt" 
            statusText={isBeltUnlocked ? 'UNLOCKED' : 'LOCKED'}
            active={!isBeltUnlocked} 
            isNaresh={isNaresh}
          />
        </div>
      </div>

      {/* BATTERY FOOTER */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center gap-6">
        <div className="flex items-center gap-2">
           <Battery className={`w-6 h-6 ${isNaresh && worker.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-600'}`} />
           <span className="text-sm font-black text-slate-700">BAT: {worker.battery}%</span>
        </div>
        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${isNaresh && worker.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${worker.battery}%` }} />
        </div>
      </div>
    </div>
  );
});

// --- SUB-COMPONENTS ---

function StatBox({ icon, value, label, critical = false }: any) {
  return (
    <div className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-300 ${
      critical ? 'bg-red-600 border-red-700 shadow-lg scale-105' : 'bg-slate-50/50 border-slate-100'
    }`}>
      <div className="mb-2">{icon}</div>
      <p className={`text-2xl font-black font-mono leading-none ${critical ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      <span className={`text-[9px] font-bold uppercase mt-1 ${critical ? 'text-red-100' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

function ComplianceBox({ icon, label, statusText, active, isNaresh }: any) {
  const isAlert = !active && isNaresh;
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
      isAlert ? 'bg-red-600 border-red-700 text-white shadow-lg animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-600'
    }`}>
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-black px-3 py-1 bg-white/20 rounded-lg uppercase">
        {statusText}
      </span>
    </div>
  );
}