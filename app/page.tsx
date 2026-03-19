'use client';

import { useState } from 'react';
import { SidebarNav, type ViewType } from '@/components/dashboard/sidebar-nav';
import { DashboardHeader } from '@/components/dashboard/header';

// ✅ Views Import (Correct Names)
import { OverviewView } from '@/components/dashboard/views/overview-view';
import { AlertsView } from '@/components/dashboard/views/alerts-view';
import { SystemStatusView } from '@/components/dashboard/views/system-status-view';
import { SurveillanceView } from '@/components/dashboard/views/surveillance-view'; 
import { AttendanceLog } from '@/components/dashboard/views/attendance-view'; // 👈 Check name here

import { WorkerGrid } from '@/components/dashboard/worker-grid';
import { EnvironmentalSummary } from '@/components/dashboard/environmental-summary';
import { SystemEventLog } from '@/components/dashboard/system-event-log';
import { useSafetyData } from '@/hooks/useSafetyData';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  
  const { workers, metrics, events, gatewayStatus, rawLogs } = useSafetyData();

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
      
      <DashboardHeader
        gatewayStatus={gatewayStatus}
        connectedWorkers={workers.length}
      />

      <div className="flex flex-1 min-w-0 overflow-hidden">

        <SidebarNav
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50/30">
          
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

            {currentView === 'workers' && (
              <WorkerGrid workers={workers} />
            )}

            {/* ✅ Surveillance View (Workers pass panrom) */}
            {currentView === 'surveillance' && (
              <div className="p-8">
                <SurveillanceView workers={workers} />
              </div>
            )}

            {/* ✅ Attendance Log (Name fixed to AttendanceLog) */}
            {currentView === 'attendance' && (
              <div className="p-8">
                <AttendanceLog /> 
              </div>
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
                  rawLogs={rawLogs}
                />
              </div>
            )}
          </div>

        </main>

        {/* Right Monitoring Panel */}
        <div className="hidden 2xl:flex flex-col border-l border-purple-100 bg-white w-96 shadow-xl">
          <EnvironmentalSummary metrics={metrics} />
          <div className="flex-1 overflow-hidden border-b border-purple-100">
            <SystemEventLog events={events} />
          </div>

          <div className="h-64 bg-slate-900 text-green-400 font-mono text-[10px] p-4 overflow-y-auto flex flex-col-reverse shadow-inner">
            {!rawLogs || rawLogs.length === 0 ? (
              <p className="text-slate-500 animate-pulse uppercase tracking-widest">
                [SYSTEM] Awaiting LoRa gateway packets...
              </p>
            ) : (
              rawLogs.map((log: string, index: number) => (
                <div key={index} className="mb-1 border-b border-slate-800 pb-1 break-all opacity-80">
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