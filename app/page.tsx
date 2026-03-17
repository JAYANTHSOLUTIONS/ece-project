'use client';

import { useState } from 'react';
import { SidebarNav, type ViewType } from '@/components/dashboard/sidebar-nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { OverviewView } from '@/components/dashboard/views/overview-view';
import { AlertsView } from '@/components/dashboard/views/alerts-view';
import { SystemStatusView } from '@/components/dashboard/views/system-status-view';

// Using WorkerGrid for the full-width layout
import { WorkerGrid } from '@/components/dashboard/worker-grid';
import { EnvironmentalSummary } from '@/components/dashboard/environmental-summary';
import { SystemEventLog } from '@/components/dashboard/system-event-log';
import { useSafetyData } from '@/hooks/useSafetyData';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  
  // Fetching live telemetry from the MQTT hook
  const { workers, metrics, events, gatewayStatus, rawLogs } = useSafetyData();

  // Connection/Loading State
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-purple-700 font-mono font-bold uppercase tracking-widest text-sm">
            Establishing Cloud Link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-foreground overflow-hidden">
      
      {/* Top Header */}
      <DashboardHeader
        gatewayStatus={gatewayStatus}
        connectedWorkers={workers.length}
      />

      <div className="flex flex-1 min-w-0 overflow-hidden">

        {/* Sidebar Navigation */}
        <SidebarNav
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* ✅ GAP FIX: 
          Removed 'p-8' and 'lg:ml-64' margin if your SidebarNav is already absolute/fixed.
          If SidebarNav is part of the flex flow, 'flex-1' will naturally take up the rest of the space.
        */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50/30">
          
          {/* ✅ WIDTH FIX: 
              Removed 'max-w-[1600px]' and 'mx-auto' to allow content to touch the edges.
          */}
          <div className="w-full h-full">
            {currentView === 'overview' && (
              <div className="p-8">
                <OverviewView
                  workers={workers}
                  metrics={metrics}
                  events={events}
                />
              </div>
            )}

            {/* ✅ WorkerGrid now controls its own internal padding for a flush look */}
            {currentView === 'workers' && (
              <WorkerGrid workers={workers} />
            )}

            {currentView === 'alerts' && (
              <div className="p-8">
                <AlertsView events={events} />
              </div>
            )}

            {currentView === 'system' && (
              <div className="p-8">
                <SystemStatusView
                  metrics={metrics}
                  workers={workers}
                />
              </div>
            )}
          </div>

        </main>

        {/* Right Monitoring Panel (Visible on Desktop) */}
        <div className="hidden 2xl:flex flex-col border-l border-purple-100 bg-white w-96 shadow-xl">

          <EnvironmentalSummary metrics={metrics} />

          <div className="flex-1 overflow-hidden border-b border-purple-100">
            <SystemEventLog events={events} />
          </div>

          {/* Hardware Debugging Terminal */}
          <div className="h-64 bg-slate-900 text-green-400 font-mono text-[10px] p-4 overflow-y-auto flex flex-col-reverse shadow-inner">

            {!rawLogs || rawLogs.length === 0 ? (
              <p className="text-slate-500 animate-pulse uppercase tracking-widest">
                [SYSTEM] Awaiting LoRa gateway packets...
              </p>
            ) : (
              rawLogs.map((log: string, index: number) => (
                <div
                  key={index}
                  className="mb-1 border-b border-slate-800 pb-1 break-all opacity-80"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}