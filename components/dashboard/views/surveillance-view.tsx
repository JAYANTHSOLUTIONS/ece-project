'use client';

import { Camera, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { Worker } from '@/lib/types';

interface SurveillanceViewProps {
  workers: Worker[];
}

export function SurveillanceView({ workers }: SurveillanceViewProps) {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">AI Surveillance Hub</h2>
        <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mt-1 italic">Live Face & PPE Monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Live Video Feed */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] aspect-video flex items-center justify-center border-4 border-slate-800 relative overflow-hidden shadow-2xl">
          <img 
            src="http://localhost:5000/video_feed" 
            alt="Live Feed"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/1280x720/0f172a/6366f1?text=Waiting+for+Python+Stream..."; }}
          />
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-pulse">
            <Camera className="w-3 h-3" /> Live Camera Stream
          </div>
        </div>

        {/* RIGHT: Status Checklist */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Live Status Checklist</h3>
          
          {workers.map((person) => {
            const isNaresh = person.name === 'Naresh G';

            return (
              <div 
                key={person.id} 
                className={`p-5 rounded-2xl border transition-all duration-500 ${
                  isNaresh 
                    ? 'bg-white border-slate-100 shadow-sm' 
                    : 'bg-slate-50 grayscale opacity-40 border-slate-200 pointer-events-none'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">
                      {person.name} {!isNaresh && <span className="text-[8px] opacity-60 ml-2">(OFFLINE)</span>}
                    </p>
                    <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest leading-none mt-1">
                      ID: {person.id}
                    </p>
                  </div>
                  {isNaresh && (
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex items-center gap-1">
                       <Zap className="w-3 h-3" />
                       <span className="text-[10px] font-black">1.2m/s</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <StatusLight label="Helmet" active={person.helmetStatus === 'Y'} />
                  <StatusLight label="Belt" active={person.beltStatus === 'L'} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusLight({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-wider ${
      active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      {label}
      {active ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
    </div>
  );
}