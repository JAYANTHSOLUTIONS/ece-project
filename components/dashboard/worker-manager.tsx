'use client';

import { addWorker, deleteWorker } from '@/app/actions/workerActions';
import { Trash2, UserPlus, RefreshCcw } from 'lucide-react';

export function WorkerManager({ workers }: { workers: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Registration Form */}
      <div className="p-8 bg-white rounded-3xl border-2 border-purple-100 shadow-sm">
        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
          <UserPlus className="text-purple-600" /> New Deployment
        </h3>
        <form action={async (formData) => {
          const name = formData.get('name') as string;
          const id = formData.get('id') as string;
          await addWorker(name, id);
        }} className="space-y-4">
          <input name="name" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl border" required />
          <input name="id" placeholder="Node ID" className="w-full p-4 bg-slate-50 rounded-xl border" required />
          <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-600 transition-colors">
            Authorize Personnel
          </button>
        </form>
      </div>

      {/* Roster Management */}
      <div className="p-8 bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
          <RefreshCcw className="text-slate-400" /> Active Roster
        </h3>
        <div className="space-y-3">
          {workers.map(w => (
            <div key={w.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border">
              <div>
                <p className="font-black text-slate-900">{w.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Node: {w.id}</p>
              </div>
              <button 
                onClick={() => confirm(`Terminate Node ${w.id}?`) && deleteWorker(w.id)}
                className="p-2 text-slate-300 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}