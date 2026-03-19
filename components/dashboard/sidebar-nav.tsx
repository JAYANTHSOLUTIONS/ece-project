'use client';

import { useState } from 'react';
// ✅ ClipboardList icon add panni irukaen attendance-kku
import { LayoutGrid, Users, AlertTriangle, Gauge, ChevronRight, Menu, X, Camera, ClipboardList } from 'lucide-react';

// ✅ 1. 'attendance' sethuttaen
export type ViewType = 'overview' | 'workers' | 'alerts' | 'system' | 'surveillance' | 'attendance';

interface SidebarNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function SidebarNav({ currentView, onViewChange }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: {
    id: ViewType;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutGrid className="w-5 h-5" />,
      description: 'KPIs & Alerts',
    },
    {
      id: 'workers',
      label: 'Workers',
      icon: <Users className="w-5 h-5" />,
      description: 'Live Telemetry',
    },
    {
      id: 'surveillance',
      label: 'AI Surveillance',
      icon: <Camera className="w-5 h-5" />,
      description: 'Face & PPE Hub',
    },
    // ✅ 2. Attendance Log tab-ah inga add panni irukaen
    {
      id: 'attendance',
      label: 'Attendance Log',
      icon: <ClipboardList className="w-5 h-5" />,
      description: 'In-Time & Out-Time',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Event Log',
    },
    {
      id: 'system',
      label: 'System Status',
      icon: <Gauge className="w-5 h-5" />,
      description: 'Environment & Gateway',
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button (No change here) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-white border border-purple-200 shadow-md rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6 text-purple-900" /> : <Menu className="w-6 h-6 text-purple-900" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative
          top-16 lg:top-0
          left-0
          h-[calc(100vh-64px)] lg:h-auto
          w-64
          bg-purple-50
          border-r border-purple-200
          transition-transform duration-300
          z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider px-2 mb-4">
              Navigation
            </h3>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full
                flex items-center justify-between
                gap-3
                px-4 py-3
                rounded-lg
                transition-all
                duration-200
                group
                ${
                  currentView === item.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-purple-100 active:bg-purple-200'
                }
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={currentView === item.id ? 'text-white' : 'text-purple-600'}>
                  {item.icon}
                </div>

                <div className="text-left min-w-0">
                  <p className={`font-medium text-sm ${currentView === item.id ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${currentView === item.id ? 'text-purple-100' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {currentView === item.id && (
                <ChevronRight className="w-4 h-4 text-white flex-shrink-0" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}