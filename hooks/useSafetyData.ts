import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { Worker, EnvironmentalMetrics, SystemEvent } from '@/lib/types';

// 1. INITIAL TEAM DATA (The "Old" data you want to keep static for mock workers)
const INITIAL_WORKERS: Worker[] = [
  { id: '513422106008', name: 'Naresh G', battery: 0, heartRate: 0, temperature: 0, gasLevel: 0, beltStatus: 'L', helmetStatus: 'Y', rssi: -100 },
  { id: '513422106009', name: 'Sangeethapriya S', battery: 85, heartRate: 72, temperature: 33.5, gasLevel: 210, beltStatus: 'L', helmetStatus: 'Y', rssi: -62 },
  { id: '513422106013', name: 'Keerthi Raja V K', battery: 92, heartRate: 75, temperature: 34.1, gasLevel: 195, beltStatus: 'L', helmetStatus: 'Y', rssi: -58 },
  { id: '513422106705', name: 'Ferolin Aksha A', battery: 78, heartRate: 80, temperature: 33.8, gasLevel: 205, beltStatus: 'L', helmetStatus: 'Y', rssi: -65 }
];

export function useSafetyData() {
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  // 2. MQTT FETCH LOGIC (Naresh G only)
  const processLiveHardware = useCallback((rawString: string) => {
    try {
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
            temperature: parseFloat(dataMap['T'] || '32.0'),
            gasLevel: parseInt(dataMap['G'] || '0'),
            beltStatus: (dataMap['B']?.trim() === 'L' ? 'L' : 'U') as 'L' | 'U',
            helmetStatus: (dataMap['H']?.trim() === 'Y' ? 'Y' : 'N') as 'Y' | 'N',
            rssi: parseInt(dataMap['RSSI'] || '-70')
          };
        }
        return w; // Keep others exactly as they are
      }));
    } catch (e) { console.error("Hardware parse error", e); }
  }, []);

  // 3. FLUCTUATION LOGIC (Vitals only for Mock Workers)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers(current => current.map(w => {
        if (w.name !== 'Naresh G') {
          return {
            ...w,
            // Only Heart Rate, Temperature, and Gas fluctuate
            heartRate: Math.floor(68 + Math.random() * 12),
            temperature: parseFloat((33.5 + Math.random() * 1.2).toFixed(1)),
            gasLevel: Math.floor(190 + Math.random() * 35),
            // BAT, H, B, and RSSI remain the "Initial" values
          };
        }
        return w;
      }));
    }, 4500); 
    return () => clearInterval(interval);
  }, []);

  // 4. MQTT SUBSCRIPTION
  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.on('connect', () => client.subscribe('naresh/mine-safety/telemetry'));
    client.on('message', (topic, msg) => {
      const raw = msg.toString();
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] IN: ${raw}`, ...prev].slice(0, 10));
      processLiveHardware(raw);
    });
    return () => { client.end(); };
  }, [processLiveHardware]);

  const metrics: EnvironmentalMetrics = {
    avgTemperature: workers.reduce((acc, w) => acc + w.temperature, 0) / workers.length,
    maxGasLevel: Math.max(...workers.map(w => w.gasLevel)),
    activeWorkers: workers.length,
    systemUptime: "Hybrid Operations"
  };

  return { workers, metrics, events, gatewayStatus: 'online' as const, rawLogs };
}