'use client';

import { EnvironmentalMetrics, Worker } from '@/lib/types';
import { Thermometer, Wind, Clock, Radio, Signal, Zap, Activity } from 'lucide-react';

interface SystemStatusViewProps {
  metrics: EnvironmentalMetrics;
  workers: Worker[];
}

export function SystemStatusView({ metrics, workers }: SystemStatusViewProps) {
  const getStatusBadge = (value: number, thresholds: { safe: number; warning: number }) => {
    if (value >= thresholds.warning) {
      return { color: 'bg-red-100 text-red-800', text: 'CRITICAL' };
    }
    if (value >= thresholds.safe) {
      return { color: 'bg-orange-100 text-orange-800', text: 'WARNING' };
    }
    return { color: 'bg-green-100 text-green-800', text: 'SAFE' };
  };

  const tempStatus = getStatusBadge(metrics.avgTemperature, { safe: 40, warning: 45 });
  const gasStatus = getStatusBadge(metrics.maxGasLevel, { safe: 500, warning: 700 });

  // Calculate signal strengths
  const avgSignal = Math.round(
    workers.reduce((sum, w) => sum + w.rssi, 0) / (workers.length || 1)
  );

  const getSignalQuality = (rssi: number) => {
    if (rssi > -50) return { text: 'Excellent', color: 'text-green-600' };
    if (rssi > -70) return { text: 'Good', color: 'text-blue-600' };
    if (rssi > -85) return { text: 'Fair', color: 'text-orange-600' };
    return { text: 'Poor', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6 lg:ml-64">
      {/* Environmental Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Monitoring */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Thermometer className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Temperature Monitoring</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Temperature</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.avgTemperature.toFixed(1)}°C</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${tempStatus.color}`}>
                {tempStatus.text}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Min</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.min(...workers.map((w) => w.temperature)).toFixed(1)}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Max</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.max(...workers.map((w) => w.temperature)).toFixed(1)}°C
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Safe</p>
                <p className="text-lg font-semibold text-green-600">&lt;40°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gas Level Monitoring */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Wind className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Gas Level Monitoring</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Max Gas Concentration</p>
                <p className="text-4xl font-bold text-gray-900">{metrics.maxGasLevel}ppm</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${gasStatus.color}`}>
                {gasStatus.text}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-purple-100">
              <div>
                <p className="text-xs text-gray-500 mb-1">Min</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.min(...workers.map((w) => w.gasLevel))}ppm
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(
                    workers.reduce((sum, w) => sum + w.gasLevel, 0) / (workers.length || 1)
                  )}ppm
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Safe</p>
                <p className="text-lg font-semibold text-green-600">&lt;500ppm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Status */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Radio className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">LoRa Gateway</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-semibold text-gray-900">Status</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Frequency</p>
                <p className="font-semibold text-gray-900">433 MHz</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Spreading Factor</p>
                <p className="font-semibold text-gray-900">SF 12</p>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Connected Nodes</p>
              <p className="text-2xl font-bold text-gray-900">{workers.length} / {workers.length}</p>
            </div>
          </div>
        </div>

        {/* Signal Quality */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Signal className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Signal Quality</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Signal Strength</p>
                <p className="text-3xl font-bold text-gray-900">{avgSignal}dBm</p>
              </div>
              <div className={`text-right`}>
                <p className={`font-semibold ${getSignalQuality(avgSignal).color}`}>
                  {getSignalQuality(avgSignal).text}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Distribution by Quality</p>
              <div className="space-y-2">
                {[
                  {
                    quality: 'Excellent',
                    range: '> -50',
                    count: workers.filter((w) => w.rssi > -50).length,
                    color: 'bg-green-100 text-green-800',
                  },
                  {
                    quality: 'Good',
                    range: '-50 to -70',
                    count: workers.filter((w) => w.rssi > -70 && w.rssi <= -50).length,
                    color: 'bg-blue-100 text-blue-800',
                  },
                  {
                    quality: 'Fair',
                    range: '-70 to -85',
                    count: workers.filter((w) => w.rssi > -85 && w.rssi <= -70).length,
                    color: 'bg-orange-100 text-orange-800',
                  },
                  {
                    quality: 'Poor',
                    range: '< -85',
                    count: workers.filter((w) => w.rssi <= -85).length,
                    color: 'bg-red-100 text-red-800',
                  },
                ].map((stat) => (
                  <div key={stat.quality} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{stat.quality}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${stat.color}`}>
                      {stat.count} node{stat.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">System Information</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-2">Uptime</p>
            <p className="font-mono font-bold text-gray-900">{metrics.systemUptime}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-2">Active Workers</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.activeWorkers}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-2">Data Points</p>
            <p className="text-2xl font-bold text-gray-900">{workers.length * 6}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 mb-2">Update Rate</p>
            <p className="font-mono font-bold text-gray-900">3s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
