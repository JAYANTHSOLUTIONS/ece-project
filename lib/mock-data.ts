import { Worker, EnvironmentalMetrics, SystemEvent } from './types';

const WORKER_NAMES = [
  'Worker 01', 'Worker 02', 'Worker 03', 'Worker 04',
  'Worker 05', 'Worker 06', 'Worker 07', 'Worker 08',
  'Worker 09', 'Worker 10', 'Worker 11', 'Worker 12',
  'Worker 13', 'Worker 14', 'Worker 15', 'Worker 16',
];

function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateWorkerTelemetry(id: string, name: string): Worker {
  const now = Date.now();
  
  // Randomly generate violations or alerts for visual variety
  const hasGasAlert = Math.random() < 0.15;
  const hasTemperatureAlert = Math.random() < 0.1;
  const hasHelmetViolation = Math.random() < 0.1;
  const hasBeltViolation = Math.random() < 0.1;
  const hasBatteryLow = Math.random() < 0.08;

  return {
    id,
    name,
    battery: hasBatteryLow ? getRandomInRange(5, 20) : getRandomInRange(40, 100),
    heartRate: getRandomInRange(60, 110),
    temperature: hasTemperatureAlert ? getRandomInRange(45, 55) : getRandomInRange(32, 44),
    gasLevel: hasGasAlert ? getRandomInRange(700, 900) : getRandomInRange(100, 600),
    beltStatus: hasBeltViolation ? 'U' : 'L',
    helmetStatus: hasHelmetViolation ? 'N' : 'Y',
    rssi: Math.floor(getRandomInRange(-90, -30)),
    lastUpdate: now - Math.floor(Math.random() * 5000), // Last 0-5 seconds
  };
}

export function generateMockWorkers(): Worker[] {
  const workers: Worker[] = [];
  for (let i = 0; i < WORKER_NAMES.length; i++) {
    const id = String(i + 1).padStart(2, '0');
    workers.push(generateWorkerTelemetry(id, WORKER_NAMES[i]));
  }
  return workers;
}

export function generateEnvironmentalMetrics(workers: Worker[]): EnvironmentalMetrics {
  const avgTemperature =
    workers.reduce((sum, w) => sum + w.temperature, 0) / workers.length;
  const maxGasLevel = Math.max(...workers.map((w) => w.gasLevel));

  const systemStartTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
  const uptimeMs = Date.now() - systemStartTime;
  const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    avgTemperature: Math.round(avgTemperature * 10) / 10,
    maxGasLevel: Math.round(maxGasLevel),
    activeWorkers: workers.length,
    systemUptime: `${hours}h ${minutes}m`,
    gatewayStatus: Math.random() > 0.05 ? 'online' : 'offline', // 95% online
  };
}

export function generateSystemEvents(workers: Worker[]): SystemEvent[] {
  const events: SystemEvent[] = [];
  const now = Date.now();

  // Generate some historical events for context
  workers.forEach((worker, index) => {
    // Gas alerts
    if (worker.gasLevel > 700) {
      events.push({
        id: `evt-${index}-gas`,
        timestamp: now - Math.random() * 60000,
        workerId: worker.id,
        workerName: worker.name,
        type: 'gas_alert',
        severity: 'critical',
        message: `High Gas Alert - ${Math.round(worker.gasLevel)}ppm`,
      });
    }

    // Temperature alerts
    if (worker.temperature > 45) {
      events.push({
        id: `evt-${index}-temp`,
        timestamp: now - Math.random() * 60000,
        workerId: worker.id,
        workerName: worker.name,
        type: 'temperature_alert',
        severity: 'critical',
        message: `High Temperature Alert - ${Math.round(worker.temperature)}°C`,
      });
    }

    // Helmet violations
    if (worker.helmetStatus === 'N') {
      events.push({
        id: `evt-${index}-helmet`,
        timestamp: now - Math.random() * 120000,
        workerId: worker.id,
        workerName: worker.name,
        type: 'helmet_violation',
        severity: 'critical',
        message: 'HELMET NOT DETECTED - SAFETY VIOLATION',
      });
    }

    // Belt violations
    if (worker.beltStatus === 'U') {
      events.push({
        id: `evt-${index}-belt`,
        timestamp: now - Math.random() * 120000,
        workerId: worker.id,
        workerName: worker.name,
        type: 'belt_violation',
        severity: 'critical',
        message: 'SAFETY BELT UNLOCKED - IMMEDIATE ACTION REQUIRED',
      });
    }

    // Battery low
    if (worker.battery < 20) {
      events.push({
        id: `evt-${index}-battery`,
        timestamp: now - Math.random() * 300000,
        workerId: worker.id,
        workerName: worker.name,
        type: 'battery_low',
        severity: 'warning',
        message: `Low Battery - ${Math.round(worker.battery)}%`,
      });
    }

    // Check-in events
    events.push({
      id: `evt-${index}-checkin`,
      timestamp: now - Math.random() * 300000,
      workerId: worker.id,
      workerName: worker.name,
      type: 'worker_check_in',
      severity: 'info',
      message: `${worker.name} checked in`,
    });
  });

  // Add system status events
  events.push({
    id: 'evt-sys-1',
    timestamp: now - 180000,
    type: 'system_status',
    severity: 'info',
    message: 'System initialized - All sensors operational',
  });

  events.push({
    id: 'evt-sys-2',
    timestamp: now - 120000,
    type: 'system_status',
    severity: 'info',
    message: 'Gateway synchronized - 16 nodes connected',
  });

  // Sort by timestamp, newest first
  return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
}

export function updateWorkerTelemetry(workers: Worker[]): Worker[] {
  return workers.map((worker) => {
    const updatedWorker = { ...worker };
    
    // Simulate small changes in telemetry
    updatedWorker.battery = Math.max(0, updatedWorker.battery + getRandomInRange(-2, 1));
    updatedWorker.heartRate = updatedWorker.heartRate + getRandomInRange(-3, 3);
    updatedWorker.temperature = updatedWorker.temperature + getRandomInRange(-1, 1);
    updatedWorker.gasLevel = Math.max(0, updatedWorker.gasLevel + getRandomInRange(-50, 50));
    updatedWorker.lastUpdate = Date.now();

    // Occasionally flip belt/helmet status for realism
    if (Math.random() < 0.02) {
      updatedWorker.beltStatus = updatedWorker.beltStatus === 'L' ? 'U' : 'L';
    }
    if (Math.random() < 0.02) {
      updatedWorker.helmetStatus = updatedWorker.helmetStatus === 'Y' ? 'N' : 'Y';
    }

    return updatedWorker;
  });
}
