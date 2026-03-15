import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { Worker, EnvironmentalMetrics, SystemEvent } from '@/lib/types';

export function parseLoRaString(dataString: string, workerId: string, workerName: string): Worker | null {
  try {
    // Parser for: "IN: DATA: BAT:0 | HR:11 | T:32.80 | G:0 | B:L | H:N | RSSI:-58"
    // Extract everything after "DATA:"
    const payload = dataString.includes('DATA:') ? dataString.split('DATA:')[1].trim() : dataString;
    const parts = payload.split('|');
    const dataMap: Record<string, string> = {};

    parts.forEach(part => {
      const [key, value] = part.split(':');
      if (key && value) dataMap[key.trim()] = value.trim();
    });

    return {
      id: workerId,
      name: workerName,
      battery: parseInt(dataMap['BAT'] || '0'),
      heartRate: parseInt(dataMap['HR'] || '0'), // BPM from MAX30102 [cite: 34]
      temperature: parseFloat(dataMap['T'] || '0'), // Temp from DHT22 [cite: 34]
      gasLevel: parseInt(dataMap['G'] || '0'), // Gas from MQ-9 [cite: 34]
      beltStatus: (dataMap['B'] === 'L' ? 'L' : 'U') as 'L' | 'U', // L: Locked, U: Unlocked
      helmetStatus: (dataMap['H'] === 'Y' ? 'Y' : 'N') as 'Y' | 'N', // Y: Detected, N: Removed
      rssi: parseInt(dataMap['RSSI'] || '-100')
    };
  } catch (e) {
    console.error("Parse error", e);
    return null;
  }
}

export function useSafetyData() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'online'>('offline');
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  const processIncomingPacket = useCallback((rawString: string) => {
    // Map to your project team member Naresh G [cite: 3]
    const parsedWorker = parseLoRaString(rawString, '513422106008', 'Naresh G');
    
    if (parsedWorker) {
      setWorkers([parsedWorker]);

      // PPE Compliance Logic [cite: 19]
      if (parsedWorker.helmetStatus === 'N') {
        const evt: SystemEvent = { id: Date.now() + '-h', type: 'helmet_violation', severity: 'critical', message: 'Helmet Removed!', timestamp: Date.now(), workerName: parsedWorker.name };
        setEvents(prev => [evt, ...prev].slice(0, 50));
      }
      if (parsedWorker.beltStatus === 'U') {
        const evt: SystemEvent = { id: Date.now() + '-b', type: 'belt_violation', severity: 'critical', message: 'Safety Belt Unlocked!', timestamp: Date.now(), workerName: parsedWorker.name };
        setEvents(prev => [evt, ...prev].slice(0, 50));
      }
    }
  }, []);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.on('connect', () => {
      setConnectionStatus('online');
      client.subscribe('naresh/mine-safety/telemetry');
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] Connected to Cloud Broker`, ...prev]);
    });

    client.on('message', (topic, message) => {
      const rawData = message.toString();
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] IN: ${rawData}`, ...prev].slice(0, 20));
      processIncomingPacket(rawData);
    });

    return () => { client.end(); };
  }, [processIncomingPacket]);

  const metrics: EnvironmentalMetrics = {
    avgTemperature: workers[0]?.temperature || 0,
    maxGasLevel: workers[0]?.gasLevel || 0,
    activeWorkers: workers.length,
    systemUptime: connectionStatus === 'online' ? "Cloud Linked" : "Connecting..."
  };

  return { workers, metrics, events, gatewayStatus: connectionStatus, rawLogs };
}