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

export type { CostData, BudgetList };
