'use client';

import { useEffect, useState } from 'react';
import { Signal, Usb } from 'lucide-react';

// 1. UPDATE: Add onConnectHardware to the interface
interface HeaderProps {
  gatewayStatus: 'online' | 'offline';
  connectedWorkers: number;
  onConnectHardware?: () => Promise<void> | void; 
}

export function DashboardHeader({ gatewayStatus, connectedWorkers, onConnectHardware }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wider">
              ⚒ COAL MINE OPERATIONS CENTER
            </h1>
            <p className="text-purple-600 text-sm mt-1">Real-time Worker Safety Monitoring System</p>
          </div>

          <div className="flex items-center gap-6">
            
            {/* 2. NEW: The USB Connect Button */}
            {gatewayStatus === 'offline' && onConnectHardware && (
              <button 
                onClick={onConnectHardware}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm font-semibold text-sm"
              >
                <Usb className="w-4 h-4" />
                CONNECT RECEIVER
              </button>
            )}

            {/* Gateway Status */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-purple-200 card-shadow">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${gatewayStatus === 'online' ? 'bg-green-600' : 'bg-red-600'}`} />
                <span className="text-xs font-mono text-purple-700">
                  GATEWAY: {gatewayStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Connected Nodes */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-purple-200 card-shadow">
              <Signal className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono text-purple-700">
                {connectedWorkers} NODES
              </span>
            </div>

            {/* System Time */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-purple-200 card-shadow">
              <span className="text-xs font-mono text-purple-700 font-bold">
                {currentTime || '00:00:00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}