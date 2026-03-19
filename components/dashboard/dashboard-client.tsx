'use client';

import { useState } from 'react';
// Layout components
import { SidebarNav, type ViewType } from '@/components/dashboard/sidebar-nav';
import { DashboardHeader } from '@/components/dashboard/header';

// Views - Intha path-la file correct-ah irukanu double check pannikkonga
import { OverviewView } from '@/components/dashboard/views/overview-view';
import { WorkersView } from '@/components/dashboard/views/workers-view';
import { SurveillanceView } from '@/components/dashboard/views/surveillance-view'; 
import { AttendanceView } from '@/components/dashboard/views/attendance-view'; 
import { AlertsView } from '@/components/dashboard/views/alerts-view';
import { SystemStatusView } from '@/components/dashboard/views/system-status-view';

// Data Hook
import { useSafetyData } from '@/hooks/useSafetyData';

export function DashboardClient() {
  // 1. Default-ah overview page kaatum
  const [currentView, setCurrentView] = useState<ViewType>('overview');

  // 2. Data fetching from our custom hook
  const { workers, metrics, events, gatewayStatus, rawLogs } = useSafetyData();

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      
      {/* HEADER SECTION */}
      <DashboardHeader 
        gatewayStatus={gatewayStatus} 
        connectedWorkers={workers.length} 
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR SECTION */}
        <SidebarNav 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          
          {/* Overview Tab */}
          {currentView === 'overview' && (
            <OverviewView 
              workers={workers} 
              metrics={metrics} 
              events={events} 
            />
          )}

          {/* Workers Tab */}
          {currentView === 'workers' && (
            <WorkersView workers={workers} />
          )}

          {/* AI Surveillance Tab */}
          {currentView === 'surveillance' && (
            <SurveillanceView workers={workers} />
          )}

          {/* Attendance Log Tab */}
          {currentView === 'attendance' && (
            <AttendanceView workers={workers} />
          )}

          {/* Alerts Tab */}
          {currentView === 'alerts' && (
            <AlertsView events={events} />
          )}

          {/* System Status Tab */}
          {currentView === 'system' && (
            <SystemStatusView 
              metrics={metrics} 
              workers={workers} 
              rawLogs={rawLogs} 
            />
          )}
          
        </main>
      </div>
    </div>
  );
}