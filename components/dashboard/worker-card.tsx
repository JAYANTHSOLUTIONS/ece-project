'use client';

import React from 'react';
import { Worker } from '@/lib/types';
import {
  Heart,
  Thermometer,
  Wind,
  Battery,
  Shield,
  AlertTriangle,
  Signal,
} from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
}

export const WorkerCard = React.memo(function WorkerCard({ worker }: WorkerCardProps) {
  const isGasCritical = worker.gasLevel > 700;
  const isTemperatureCritical = worker.temperature > 45;
  const isHelmetViolation = worker.helmetStatus === 'N';
  const isBeltViolation = worker.beltStatus === 'U';
  const isCritical = isGasCritical || isTemperatureCritical || isHelmetViolation || isBeltViolation;

  const getBatteryColor = (battery: number) => {
    if (battery < 20) return 'text-red-600 bg-red-100';
    if (battery < 50) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getHeartRateColor = (hr: number) => {
    if (hr > 110 || hr < 50) return 'text-orange-600 bg-orange-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getTempColor = (temp: number) => {
    if (temp > 45) return 'text-red-600 bg-red-100';
    if (temp > 40) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getGasColor = (gas: number) => {
    if (gas > 700) return 'text-red-600 bg-red-100';
    if (gas > 500) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getSignalColor = (rssi: number) => {
    if (rssi > -50) return 'text-green-600';
    if (rssi > -70) return 'text-blue-600';
    if (rssi > -85) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      className={`rounded-lg border transition-all duration-300 overflow-hidden card-shadow ${
        isCritical
          ? 'pulse-red border-red-500 bg-red-50'
          : 'border-purple-200 bg-card card-hover'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
          <p className="text-xs text-purple-600 font-mono">ID: {worker.id}</p>
        </div>
        {isCritical && (
          <div className="animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
        )}
      </div>

      {/* Violations Section */}
      {(isHelmetViolation || isBeltViolation) && (
        <div className="px-4 pt-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {isHelmetViolation && (
              <div className="px-2 py-1 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
                HELMET VIOLATION
              </div>
            )}
            {isBeltViolation && (
              <div className="px-2 py-1 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
                BELT VIOLATION
              </div>
            )}
          </div>
        </div>
      )}

      {/* Telemetry Grid */}
      <div className="p-4 space-y-3">
        {/* Battery */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono text-gray-600">BATTERY</span>
          </div>
          <div className={`text-sm font-bold rounded px-2 py-1 ${getBatteryColor(worker.battery)}`}>
            {worker.battery.toFixed(0)}%
          </div>
        </div>

        {/* Heart Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            <span className="text-xs font-mono text-gray-600">HEART RATE</span>
          </div>
          <div className={`text-sm font-bold rounded px-2 py-1 ${getHeartRateColor(worker.heartRate)}`}>
            {worker.heartRate.toFixed(0)} BPM
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-mono text-gray-600">TEMPERATURE</span>
          </div>
          <div className={`text-sm font-bold rounded px-2 py-1 ${getTempColor(worker.temperature)}`}>
            {worker.temperature.toFixed(1)}°C
          </div>
        </div>

        {/* Gas Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono text-gray-600">GAS LEVEL</span>
          </div>
          <div className={`text-sm font-bold rounded px-2 py-1 ${getGasColor(worker.gasLevel)}`}>
            {worker.gasLevel.toFixed(0)} ppm
          </div>
        </div>

        {/* Belt Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono text-gray-600">BELT</span>
          </div>
          <div
            className={`text-sm font-bold rounded px-2 py-1 ${
              worker.beltStatus === 'L'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600 animate-pulse'
            }`}
          >
            {worker.beltStatus === 'L' ? 'LOCKED' : 'UNLOCKED'}
          </div>
        </div>

        {/* Helmet Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono text-gray-600">HELMET</span>
          </div>
          <div
            className={`text-sm font-bold rounded px-2 py-1 ${
              worker.helmetStatus === 'Y'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600 animate-pulse'
            }`}
          >
            {worker.helmetStatus === 'Y' ? 'DETECTED' : 'NOT DETECTED'}
          </div>
        </div>
      </div>

      {/* Signal Strength Footer */}
      <div className="px-4 py-3 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Signal className={`w-4 h-4 ${getSignalColor(worker.rssi)}`} />
          <span className="text-xs font-mono text-gray-600">RSSI</span>
        </div>
        <span className={`text-xs font-mono font-bold ${getSignalColor(worker.rssi)}`}>
          {worker.rssi} dBm
        </span>
      </div>
    </div>
  );
});
