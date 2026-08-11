interface CostData {
  id: number;
  resource_name: string;
  service: string;
  region: string;
  tags: Record<string, string>;
  daily_cost: number;
  monthly_cost: number;
}

interface BudgetList {
  id: string;
  scope_type: string;
  scope_value: string;
  monthly_limit: number;
  current_spend: number;
  threshold_percent: number;
  alert_channel: string;
  is_active: boolean;
  created_at: Date;
}

interface BudgetLimit {
  scope_value: string;
  monthly_limit: number;
  current_spend: number;
  threshold_percent: number;
}

interface Anomaly {
  cost_date: Date;
  service: string;
  region: string;
  daily_cost: number;
  prev_day_cost: number;
  avg_7d: number;
  stddev_7d: number;
}
type CostTrend<K extends string> = {
  [key in K]: string;
} & {
  total_cost: number;
};

export type { CostData, BudgetList, BudgetLimit, Anomaly, CostTrend };
