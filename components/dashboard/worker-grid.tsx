'use client';

import { Worker } from '@/lib/types';
import { WorkerCard } from './worker-card';

interface WorkerGridProps {
  workers: Worker[];
}

export function WorkerGrid({ workers }: WorkerGridProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white">
      <h2 className="text-lg font-bold text-purple-900 mb-4 tracking-wider">
        ACTIVE WORKER NODES ({workers.length})
      </h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}
