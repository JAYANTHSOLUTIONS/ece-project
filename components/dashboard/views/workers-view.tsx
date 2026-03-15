'use client';

import { Worker } from '@/lib/types';
import { WorkerCard } from '../worker-card';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface WorkersViewProps {
  workers: Worker[];
}

export function WorkersView({ workers }: WorkersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalCount = filteredWorkers.filter(
    (w) =>
      w.gasLevel > 700 ||
      w.temperature > 45 ||
      w.helmetStatus === 'N' ||
      w.beltStatus === 'U'
  ).length;

  return (
    <div className="space-y-6 lg:ml-64">
      {/* Header with Search */}
      <div className="bg-white border border-purple-200 rounded-lg p-6 card-shadow">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Worker Telemetry</h2>
            <p className="text-gray-600">
              Real-time monitoring of {filteredWorkers.length} active worker{filteredWorkers.length !== 1 ? 's' : ''}
              {criticalCount > 0 && <span className="text-red-600 font-semibold"> • {criticalCount} alert{criticalCount !== 1 ? 's' : ''}</span>}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-purple-50"
            />
          </div>
        </div>
      </div>

      {/* Worker Grid */}
      {filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-purple-200 rounded-lg p-12 card-shadow text-center">
          <p className="text-gray-600 font-medium">No workers found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
