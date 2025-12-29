
export interface OTPDocument {
  id: string;
  code: string;
  status: 'pending' | 'sent' | 'failed';
  timestamp: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export enum BotStatus {
  OFFLINE = 'Offline',
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  SCAN_QR = 'Waiting for QR',
  PAIRING = 'Pairing Code'
}
