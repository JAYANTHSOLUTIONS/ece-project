'use client';

import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { Worker, EnvironmentalMetrics, SystemEvent } from '@/lib/types';

// 🟢 Naresh mattum active, mathavunga ellam 0-la freeze aagi irupaanga
const INITIAL_WORKERS: Worker[] = [
  { id: '513422106008', name: 'Naresh G', battery: 0, heartRate: 0, temperature: 0, gasLevel: 0, beltStatus: 'U', helmetStatus: 'N', rssi: -100 },
  { id: '513422106009', name: 'Sangeethapriya S', battery: 0, heartRate: 0, temperature: 0, gasLevel: 0, beltStatus: 'U', helmetStatus: 'N', rssi: 0 },
  { id: '513422106013', name: 'Keerthi Raja V K', battery: 0, heartRate: 0, temperature: 0, gasLevel: 0, beltStatus: 'U', helmetStatus: 'N', rssi: 0 },
  { id: '513422106705', name: 'Ferolin Aksha A', battery: 0, heartRate: 0, temperature: 0, gasLevel: 0, beltStatus: 'U', helmetStatus: 'N', rssi: 0 }
];

export function useSafetyData() {
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  const processIncomingData = useCallback((topic: string, rawString: string) => {
    try {
      // 🎥 AI Camera Data (Anyone detected)
      if (topic === 'mine/surveillance/data') {
        const data = JSON.parse(rawString);
        setWorkers(current => current.map(w => {
          if (w.name.toLowerCase().includes(data.name.toLowerCase())) {
            return { ...w, helmetStatus: data.helmet ? 'Y' : 'N' };
          }
          return w;
        }));
      } 
      // 🛠️ Hardware Data (Only Naresh G)
      else if (topic === 'naresh/mine-safety/telemetry') {
        const payload = rawString.includes('DATA:') ? rawString.split('DATA:')[1].trim() : rawString;
        const parts = payload.split('|');
        const dataMap: Record<string, string> = {};
        parts.forEach(p => { 
          const [k, v] = p.split(':'); 
          if (k && v) dataMap[k.trim()] = v.trim(); 
        });

        setWorkers(current => current.map(w => {
          if (w.name === 'Naresh G') {
            return {
              ...w,
              battery: parseInt(dataMap['BAT'] || '0'),
              heartRate: parseInt(dataMap['HR'] || '0'),
              temperature: parseFloat(dataMap['T'] || '0'),
              gasLevel: parseInt(dataMap['G'] || '0'),
              beltStatus: (dataMap['B']?.trim() === 'L' ? 'L' : 'U') as 'L' | 'U',
              helmetStatus: (dataMap['H']?.trim() === 'Y' ? 'Y' : 'N') as 'Y' | 'N',
              rssi: parseInt(dataMap['RSSI'] || '-70')
            };
          }
          return w;
        }));
      }
    } catch (e) { console.error("MQTT Parse Error", e); }
  }, []);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.on('connect', () => {
      client.subscribe('mine/surveillance/data');
      client.subscribe('naresh/mine-safety/telemetry');
    });
    client.on('message', (topic, msg) => {
      processIncomingData(topic, msg.toString());
    });
    return () => { client.end(); };
  }, [processIncomingData]);

  const metrics: EnvironmentalMetrics = {
    avgTemperature: workers.find(w => w.name === 'Naresh G')?.temperature || 0,
    maxGasLevel: workers.find(w => w.name === 'Naresh G')?.gasLevel || 0,
    activeWorkers: 1, // Only Naresh is active
    systemUptime: "Live Operations"
  };

  return { workers, metrics, events: [], gatewayStatus: 'online' as const, rawLogs };
}