import { useQuery } from "@tanstack/react-query";
import getAlertRule from "@/lib/queries/getAlertRule";

export default function useAlertRuleSearch(budgetId) {
  return useQuery({
    queryKey: ["alertRule", budgetId],
    queryFn: () => getAlertRule(budgetId),
    enabled: Boolean(budgetId),
  });
}
