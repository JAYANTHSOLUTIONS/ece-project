'use client';

import { Worker } from '@/lib/types';
import { WorkerCard } from './worker-card';

interface WorkerGridProps {
  workers: Worker[];
}

export function WorkerGrid({ workers }: WorkerGridProps) {
  return (
    /* Removed p-10 and replaced with p-6 for better edge spacing */
    <div className="w-full p-6 bg-slate-50/50">
      
      {/* ✅ REMOVED mx-auto and max-w-[1800px] to kill the gap */}
      <div className="w-full"> 

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            Personnel Safety Command
          </h2>

          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black">
            {workers.length} ACTIVE NODES
          </span>
        </div>

        {/* WORKER GRID - Increased to 2 columns with a gap that fills the width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </div>
    </div>
  );
}