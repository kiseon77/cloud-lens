import { useQuery } from "@tanstack/react-query";
import getBudgetScopeOptions from "../queries/getBudgetScopeOptions";

export default function useBudgetScopeOptions(scopeType: "TEAM" | "PROJECT") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgetScopeOptions", scopeType], // scopeType도 key에 포함
    queryFn: async () => getBudgetScopeOptions(scopeType),
    enabled: !!scopeType, // 값 없을 때 호출 방지
  });
  return { data, isLoading, error };
}
