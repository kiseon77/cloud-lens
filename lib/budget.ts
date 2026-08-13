import { BudgetLimit } from "@/lib/type";

export const BUDGET_WARNING_THRESHOLD_PERCENT = 80;
export const NEAR_THRESHOLD_GAP_PERCENT = 20;

export function getBudgetUsagePercent(
  currentSpend: number,
  monthlyLimit: number,
): number {
  if (monthlyLimit === 0) return 0;
  return Number(((currentSpend / monthlyLimit) * 100).toFixed(1));
}

export function isBudgetWarning(usagePercent: number): boolean {
  return usagePercent >= BUDGET_WARNING_THRESHOLD_PERCENT;
}

export function getTotalBudgetUsagePercent(data: BudgetLimit[]): number {
  if (!data || data.length === 0) return 0;

  const total = data.reduce(
    (acc, curr) => ({
      totalLimit: acc.totalLimit + curr.monthly_limit,
      totalSpend: acc.totalSpend + curr.current_spend,
    }),
    { totalLimit: 0, totalSpend: 0 },
  );

  return getBudgetUsagePercent(total.totalSpend, total.totalLimit);
}
