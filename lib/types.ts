export interface Worker {
  id: string;
  name: string;
  battery: number;       // BAT (0-100)
  heartRate: number;     // HR (bpm)
  temperature: number;   // T (°C)
  gasLevel: number;      // G (ppm)
  beltStatus: 'L' | 'U'; // B (Locked/Unlocked)
  helmetStatus: 'Y' | 'N'; // H (Detected/Not Detected)
  rssi: number;          // Signal strength
}

export interface EnvironmentalMetrics {
  avgTemperature: number;
  maxGasLevel: number;
  activeWorkers: number;
  systemUptime: string;
}

export interface SystemEvent {
  id: string;
  type: 'gas_alert' | 'temperature_alert' | 'helmet_violation' | 'belt_violation' | 'battery_low' | 'heart_rate_anomaly' | 'worker_check_in' | 'system_status';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  workerId?: string;
  workerName?: string;
}