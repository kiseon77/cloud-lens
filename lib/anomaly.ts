import { Anomaly } from "@/lib/type";

export const ANOMALY_THRESHOLD_PERCENT = 30;

export function getAnomalyPercent(item: Anomaly): number {
  return Math.round(
    ((item.daily_cost - item.prev_day_cost) / item.prev_day_cost) * 100,
  );
}

export function detectAnomalies(data: Anomaly[] | undefined): Anomaly[] {
  if (!data || data.length === 0) return [];
  return data.filter(
    (item) => getAnomalyPercent(item) > ANOMALY_THRESHOLD_PERCENT,
  );
}
