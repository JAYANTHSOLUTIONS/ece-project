import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { Worker, EnvironmentalMetrics, SystemEvent } from '@/lib/types';

export function parseLoRaString(dataString: string, workerId: string, workerName: string, rssi: number = -70): Worker | null {
  try {
    const cleanedString = dataString.replace('TELEMETRY:', '').trim();
    const parts = cleanedString.split('|');
    const dataMap: Record<string, string> = {};

    parts.forEach(part => {
      const [key, value] = part.split(':');
      if (key && value) dataMap[key.trim()] = value.trim();
    });

    if (!dataMap['BAT'] && !dataMap['HR']) return null;

    return {
      id: workerId,
      name: workerName,
      battery: parseInt(dataMap['BAT'] || '0'),
      heartRate: parseInt(dataMap['HR'] || '0'),
      temperature: parseFloat(dataMap['T'] || '0'),
      gasLevel: parseInt(dataMap['G'] || '0'),
      beltStatus: (dataMap['B']?.trim() === 'L' ? 'L' : 'U') as 'L' | 'U',
      helmetStatus: (dataMap['H']?.trim() === 'Y' ? 'Y' : 'N') as 'Y' | 'N',
      rssi: rssi
    };
  } catch (error) {
    console.error("Failed to parse packet:", error);
    return null;
  }
}

export function useSafetyData() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'online'>('offline');
  
  // ✅ ADDED: State for the raw terminal logs
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  const processIncomingPacket = useCallback((rawString: string) => {
    const parsedWorker = parseLoRaString(rawString, 'W-001', 'Naresh G', -65);
    
    if (parsedWorker) {
      setWorkers(current => {
        const exists = current.findIndex(w => w.id === parsedWorker.id);
        if (exists >= 0) {
          const newArray = [...current];
          newArray[exists] = parsedWorker;
          return newArray;
        }
        return [...current, parsedWorker];
      });

      if (parsedWorker.helmetStatus === 'N') {
        const evt: SystemEvent = { id: Date.now() + '-h', type: 'helmet_violation', severity: 'critical', message: 'Helmet removed', timestamp: Date.now(), workerName: parsedWorker.name };
        setEvents(prev => [evt, ...prev].slice(0, 50));
      }
      if (parsedWorker.beltStatus === 'U') {
        const evt: SystemEvent = { id: Date.now() + '-b', type: 'belt_violation', severity: 'critical', message: 'Belt unlocked', timestamp: Date.now(), workerName: parsedWorker.name };
        setEvents(prev => [evt, ...prev].slice(0, 50));
      }
      if (parsedWorker.gasLevel > 700) {
        const evt: SystemEvent = { id: Date.now() + '-g', type: 'gas_alert', severity: 'critical', message: `High gas: ${parsedWorker.gasLevel}ppm`, timestamp: Date.now(), workerName: parsedWorker.name };
        setEvents(prev => [evt, ...prev].slice(0, 50));
      }
    }
  }, []);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      setConnectionStatus('online');
      client.subscribe('naresh/mine-safety/telemetry');
      // ✅ ADDED: Push connection success to logs
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] Connected to Cloud Broker`, ...prev]);
    });

    client.on('message', (topic, message) => {
      const rawData = message.toString();
      // ✅ ADDED: Push incoming data to logs (keeps the last 20 messages)
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] IN: ${rawData}`, ...prev].slice(0, 20));
      processIncomingPacket(rawData);
    });

    client.on('error', (err) => {
      setConnectionStatus('offline');
      setRawLogs(prev => [`[${new Date().toLocaleTimeString()}] ERROR: Connection lost`, ...prev]);
    });

    return () => {
      client.end();
    };
  }, [processIncomingPacket]);

  const metrics: EnvironmentalMetrics = {
    avgTemperature: workers.reduce((acc, w) => acc + w.temperature, 0) / (workers.length || 1),
    maxGasLevel: Math.max(...workers.map(w => w.gasLevel), 0),
    activeWorkers: workers.length,
    systemUptime: connectionStatus === 'online' ? "Cloud Linked" : "Connecting..."
  };

  // ✅ ADDED: Ensure rawLogs is returned here!
  return { workers, metrics, events, gatewayStatus: connectionStatus, rawLogs };
}