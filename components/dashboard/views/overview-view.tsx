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
    <div className="space-y-6 lg:ml-64">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Workers */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">ACTIVE</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Connected Workers</h3>
          <p className="text-3xl font-bold text-gray-900">{workers.length}</p>
          <p className="text-xs text-gray-500 mt-2">All nodes online</p>
        </div>

        {/* Avg Temperature */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8 text-orange-600" />
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(
                metrics.avgTemperature,
                { safe: 40, warning: 45 }
              )}`}
            >
              {metrics.avgTemperature > 45 ? 'CRITICAL' : metrics.avgTemperature > 40 ? 'WARNING' : 'SAFE'}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Avg Temperature</h3>
          <p className="text-3xl font-bold text-gray-900">{metrics.avgTemperature.toFixed(1)}°C</p>
          <p className="text-xs text-gray-500 mt-2">Mine ambient</p>
        </div>

        {/* Max Gas Level */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-8 h-8 text-purple-600" />
            <span
              className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(
                metrics.maxGasLevel,
                { safe: 500, warning: 700 }
              )}`}
            >
              {metrics.maxGasLevel > 700 ? 'CRITICAL' : metrics.maxGasLevel > 500 ? 'WARNING' : 'SAFE'}
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Max Gas Level</h3>
          <p className="text-3xl font-bold text-gray-900">{metrics.maxGasLevel}ppm</p>
          <p className="text-xs text-gray-500 mt-2">MQ-9 sensor</p>
        </div>

        {/* System Uptime */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-green-600" />
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">RUNNING</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">System Uptime</h3>
          <p className="text-2xl font-bold text-gray-900 font-mono">{metrics.systemUptime}</p>
          <p className="text-xs text-gray-500 mt-2">No interruptions</p>
        </div>
      </div>

      {/* Critical Alerts & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Workers */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Active Violations</h3>
            <span className="ml-auto text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
              {criticalWorkers.length}
            </span>
          </div>

          {criticalWorkers.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {criticalWorkers.map((worker) => {
                const violations = [];
                if (worker.helmetStatus === 'N') violations.push('No Helmet');
                if (worker.beltStatus === 'U') violations.push('Belt Unlocked');
                if (worker.gasLevel > 700) violations.push('High Gas');
                if (worker.temperature > 45) violations.push('High Temp');

                return (
                  <div key={worker.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-semibold text-gray-900">{worker.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {violations.map((v) => (
                        <span key={v} className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">All workers in compliance</p>
          )}
        </div>

        {/* Recent Critical Events */}
        <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Recent Critical Events</h3>
            <span className="ml-auto text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
              {recentCriticalEvents.length}
            </span>
          </div>

          {recentCriticalEvents.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentCriticalEvents.map((event, i) => (
                <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{event.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(event.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent critical events</p>
          )}
        </div>
      </div>
    </div>
  );
}
