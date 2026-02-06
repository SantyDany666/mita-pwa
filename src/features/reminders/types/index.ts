export interface ScheduleConfig {
  frequency: string;
  duration: string;
  startTime: string;
  startDate: string;
}

export interface StockConfig {
  stock?: number;
  stockAlertEnabled?: boolean;
  stockThreshold?: number;
}
