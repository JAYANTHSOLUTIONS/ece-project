'use client';

import { useState } from 'react';
import { SidebarNav, type ViewType } from '@/components/dashboard/sidebar-nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { OverviewView } from '@/components/dashboard/views/overview-view';
import { WorkersView } from '@/components/dashboard/views/workers-view';
import { AlertsView } from '@/components/dashboard/views/alerts-view';
import { SystemStatusView } from '@/components/dashboard/views/system-status-view';
import { EnvironmentalSummary } from '@/components/dashboard/environmental-summary';
import { SystemEventLog } from '@/components/dashboard/system-event-log';
import { useSafetyData } from '@/hooks/useSafetyData';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const { workers, metrics, events, gatewayStatus, rawLogs } = useSafetyData();

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-purple-700 font-mono">Connecting to Cloud Broker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <DashboardHeader gatewayStatus={gatewayStatus} connectedWorkers={workers.length} />

      <div className="flex flex-1 overflow-hidden">
        <SidebarNav currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:ml-64">
          {currentView === 'overview' && <OverviewView workers={workers} metrics={metrics} events={events} />}
          {currentView === 'workers' && <WorkersView workers={workers} />}
          {currentView === 'alerts' && <AlertsView events={events} />}
          {currentView === 'system' && <SystemStatusView metrics={metrics} workers={workers} />}
        </main>

        {/* Right sidebars */}
        <div className="hidden 2xl:flex flex-col border-l border-purple-200 bg-white w-80">
          <EnvironmentalSummary metrics={metrics} />
          <div className="flex-1 overflow-hidden border-b border-purple-200">
             <SystemEventLog events={events} />
          </div>
          
          {/* LIVE DATA TERMINAL with explicit TypeScript types */}
          <div className="h-48 bg-gray-900 text-green-400 font-mono text-xs p-3 overflow-y-auto flex flex-col-reverse">
            {!rawLogs || rawLogs.length === 0 ? (
              <p className="text-gray-500 animate-pulse">Waiting for hardware data...</p>
            ) : (
              rawLogs.map((log: string, index: number) => (
                <div key={index} className="mb-1 border-b border-gray-800 pb-1 break-all">
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