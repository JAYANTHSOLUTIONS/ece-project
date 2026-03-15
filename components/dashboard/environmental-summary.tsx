'use client';

import { Thermometer, Wind, Zap, Clock } from 'lucide-react';
import { EnvironmentalMetrics } from '@/lib/types';

interface EnvironmentalSummaryProps {
  metrics: EnvironmentalMetrics;
}

export function EnvironmentalSummary({ metrics }: EnvironmentalSummaryProps) {
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

  return (
    <aside className="w-80 bg-purple-50 border-r border-purple-200 p-6 overflow-y-auto h-[calc(100vh-73px)] card-shadow">
      <h2 className="text-lg font-bold text-purple-900 mb-6 tracking-wider">
        ENVIRONMENTAL STATUS
      </h2>

      <div className="space-y-4">
        {/* Average Temperature */}
        <div className="p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-shadow card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono text-gray-600">AVG TEMPERATURE</span>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getTempColor(metrics.avgTemperature)} rounded px-2 py-1`}>
            {metrics.avgTemperature.toFixed(1)}°C
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {metrics.avgTemperature > 45
              ? '⚠ CRITICAL - Evacuation may be required'
              : metrics.avgTemperature > 40
                ? '⚠ WARNING - Monitor closely'
                : '✓ SAFE - Within normal range'}
          </p>
        </div>

        {/* Max Gas Level */}
        <div className="p-4 rounded-lg bg-white border border-purple-200 hover:shadow-md transition-shadow card-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono text-gray-600">MAX GAS LEVEL</span>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getGasColor(metrics.maxGasLevel)} rounded px-2 py-1`}>
            {metrics.maxGasLevel} ppm
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {metrics.maxGasLevel > 700
              ? '⚠ CRITICAL - Immediate action needed'
              : metrics.maxGasLevel > 500
                ? '⚠ WARNING - Enhanced ventilation'
                : '✓ SAFE - Normal levels'}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200" />

        {/* Active Workers */}
        <div className="p-4 rounded-lg bg-white border border-purple-200 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-xs font-mono text-gray-600">ACTIVE WORKERS</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {metrics.activeWorkers}/{metrics.activeWorkers}
          </div>
          <p className="text-xs text-green-600 mt-2">All nodes connected and operational</p>
        </div>

        {/* System Uptime */}
        <div className="p-4 rounded-lg bg-white border border-purple-200 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-mono text-gray-600">SYSTEM UPTIME</span>
          </div>
          <div className="text-xl font-mono text-purple-700 font-bold">{metrics.systemUptime}</div>
          <p className="text-xs text-gray-600 mt-2">Continuous operation</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-purple-200">
        <h3 className="text-xs font-bold text-purple-900 mb-3 tracking-wider">SAFETY THRESHOLDS</h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600" />
            <span className="text-gray-700">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="text-gray-700">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-gray-700">Critical</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
