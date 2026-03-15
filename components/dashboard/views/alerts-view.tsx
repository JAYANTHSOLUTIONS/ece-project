'use client';

import { SystemEvent } from '@/lib/types';
import { AlertTriangle, AlertCircle, Info, Filter } from 'lucide-react';
import { useState } from 'react';

interface AlertsViewProps {
  events: SystemEvent[];
}

export function AlertsView({ events }: AlertsViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredEvents = events.filter((e) => filterSeverity === 'all' || e.severity === filterSeverity);

  const getEventStyle = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          badge: 'bg-red-100 text-red-800',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800',
        };
      case 'info':
      default:
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-300',
          icon: Info,
          iconColor: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800',
        };
    }
  };

  const severityStats = {
    critical: events.filter((e) => e.severity === 'critical').length,
    warning: events.filter((e) => e.severity === 'warning').length,
    info: events.filter((e) => e.severity === 'info').length,
  };

  return (
    <div className="space-y-6 lg:ml-64">
      {/* Header with Stats */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">System Alerts</h2>
            <p className="text-gray-600">Total {events.length} event{events.length !== 1 ? 's' : ''}</p>
          </div>
          <Filter className="w-6 h-6 text-purple-600" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Events', count: events.length, color: 'bg-gray-100 text-gray-800' },
            { id: 'critical', label: 'Critical', count: severityStats.critical, color: 'bg-red-100 text-red-800' },
            { id: 'warning', label: 'Warning', count: severityStats.warning, color: 'bg-orange-100 text-orange-800' },
            { id: 'info', label: 'Info', count: severityStats.info, color: 'bg-purple-100 text-purple-800' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterSeverity(filter.id as any)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterSeverity === filter.id
                  ? filter.color + ' ring-2 ring-offset-2 ring-purple-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              <span className="ml-2 font-bold">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map((event, index) => {
            const style = getEventStyle(event.severity);
            const IconComponent = style.icon;

            return (
              <div
                key={index}
                className={`${style.bg} border ${style.border} rounded-lg p-4 transition-all hover:shadow-md`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{event.message}</p>
                        <p className="text-sm text-gray-600 mt-1">Worker ID: {event.workerId}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${style.badge} whitespace-nowrap`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-purple-200 rounded-lg p-12 card-shadow text-center">
          <Info className="w-12 h-12 text-purple-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No {filterSeverity === 'all' ? 'events' : filterSeverity + ' events'} at this time</p>
        </div>
      )}
    </div>
  );
}
