'use client';

import React from 'react';
import { Worker } from '@/lib/types';
import { Heart, Thermometer, Wind, Battery, Lock, HardHat, AlertTriangle, Signal } from 'lucide-react';

export const WorkerCard = React.memo(function WorkerCard({ worker }: { worker: Worker }) {
  const isHelmetOff = worker.helmetStatus === 'N';
  const isBeltUnlocked = worker.beltStatus === 'U';
  const isGasCritical = worker.gasLevel > 700;
  const isCritical = isHelmetOff || isBeltUnlocked || isGasCritical;

  return (
    <div className={`rounded-xl border-2 transition-all shadow-lg overflow-hidden ${isCritical ? 'border-red-500 bg-red-50 animate-pulse' : 'border-purple-100 bg-white'}`}>
      <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
          <p className="text-xs text-purple-600 font-mono">ID: {worker.id}</p>
        </div>
        {isCritical && <AlertTriangle className="w-5 h-5 text-red-600" />}
      </div>

      <div className="p-4 space-y-4">
        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            <span className="text-sm font-bold">{worker.heartRate} BPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold">{worker.temperature.toFixed(1)}°C</span>
          </div>
        </div>

        {/* PPE Compliance */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2 rounded-lg ${isHelmetOff ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase">
              <HardHat className="w-4 h-4" /> HELMET
            </div>
            <span className="text-[10px] font-black">{isHelmetOff ? 'REMOVED' : 'DETECTED'}</span>
          </div>

          <div className={`flex items-center justify-between p-2 rounded-lg ${isBeltUnlocked ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase">
              <Lock className="w-4 h-4" /> SAFETY BELT
            </div>
            <span className="text-[10px] font-black">{isBeltUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
          </div>
        </div>

        {/* Signal and Battery Footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-400">
           <span className="flex items-center gap-1"><Battery className="w-3 h-3" /> {worker.battery}%</span>
           <span className="flex items-center gap-1"><Signal className="w-3 h-3" /> {worker.rssi} dBm</span>
        </div>
      </div>
    </div>
  );
});