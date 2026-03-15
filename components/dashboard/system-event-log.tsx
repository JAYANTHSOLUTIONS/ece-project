'use client';

import { useEffect, useRef } from 'react';
import { SystemEvent } from '@/lib/types';
import { AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SystemEventLogProps {
  events: SystemEvent[];
}

export function SystemEventLog({ events }: SystemEventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to newest events
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [events]);

  const getEventIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'gas_alert':
      case 'temperature_alert':
      case 'helmet_violation':
      case 'belt_violation':
        return <AlertTriangle className="w-4 h-4" />;
      case 'battery_low':
        return <Zap className="w-4 h-4" />;
      case 'heart_rate_anomaly':
        return <AlertCircle className="w-4 h-4" />;
      case 'worker_check_in':
      case 'system_status':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getEventStyle = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'warning':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'info':
      default:
        return 'bg-purple-100 border-purple-300 text-purple-800';
    }
  };

  const getIconColor = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
      default:
        return 'text-purple-600';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="w-80 bg-blue-50 border-l border-purple-200 flex flex-col h-[calc(100vh-73px)] card-shadow">
      {/* Header */}
      <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-bold text-purple-900 tracking-wider">SYSTEM EVENT LOG</h2>
        <p className="text-xs text-gray-600 mt-1">{events.length} events</p>
      </div>

      {/* Events Scroll Area */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="space-y-2 p-4">
          {events.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-xs text-center">No events recorded</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all hover:shadow-md ${getEventStyle(
                  event.severity
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${getIconColor(event.severity)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold uppercase">
                        {event.severity === 'critical' ? '⚠ ' : ''}
                        {event.severity === 'warning' ? '⚡ ' : ''}
                        {event.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs leading-tight mb-2">{event.message}</p>
                    <div className="flex items-center justify-between">
                      {event.workerId && (
                        <span className="text-xs font-mono opacity-70">
                          {event.workerName}
                        </span>
                      )}
                      <span className="text-xs font-mono opacity-50 ml-auto">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-xs text-gray-600 text-center">
        <p>Latest 50 events • Auto-refresh enabled</p>
      </div>
    </div>
  );
}
