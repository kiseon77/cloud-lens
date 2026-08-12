import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getBudgetSearch from "../queries/getBudgetSearch";

export default function useBudgetSearch(scopeType: string, scopeValue: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgetSearchData", scopeType, scopeValue],
    queryFn: async () => getBudgetSearch(scopeType, scopeValue),
    placeholderData: keepPreviousData,
    enabled: Boolean(scopeType && scopeValue),
  });
  return { data, isLoading, error };
}
