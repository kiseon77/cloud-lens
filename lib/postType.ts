interface BudgetPayload {
  scope_type: string;
  scope_value: string;
  monthly_limit: number;
}

interface BudgetUpdatePayload {
  id: string | number;
  threshold_percent?: number;
  alert_channel?: string | null;
  is_active?: boolean;
}

interface AlertRulePayload {
  budget_id: string | number;
  description: string;
  channel: string;
  is_active: boolean;
}

interface AlertRuleUpdatePayload {
  id: string | number;
  description?: string;
  channel?: string;
  is_active?: boolean;
}

interface ToggleAlertRulePayload {
  id: string | number;
  is_active: boolean;
}

export type {
  BudgetPayload,
  BudgetUpdatePayload,
  AlertRulePayload,
  AlertRuleUpdatePayload,
  ToggleAlertRulePayload,
};
