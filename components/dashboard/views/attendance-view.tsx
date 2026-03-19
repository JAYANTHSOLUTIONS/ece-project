'use client';

import { useState, useEffect } from 'react';

export function AttendanceLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Flask API-la irunthu data-va fetch panrom
    fetch('http://localhost:5000/attendance_data')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error("Error fetching attendance:", err));
  }, []); // Every time page refresh aagum pothu update aagum

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black text-slate-900 uppercase">Attendance Log</h2>
      
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Worker Name</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Entry</th>
              <th className="px-6 py-4">Exit</th>
              <th className="px-6 py-4">Work Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log: any, index) => (
              <tr key={index} className="text-sm text-slate-600 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-900">{log.Name}</td>
                <td className="px-6 py-4">{log.Date}</td>
                <td className="px-6 py-4">{log["Entry Time"]}</td>
                <td className="px-6 py-4">{log["Exit Time"] || 'Active'}</td>
                <td className="px-6 py-4 text-purple-600 font-bold">{log["Working Hours"]}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}