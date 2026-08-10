import { useQuery } from "@tanstack/react-query";
import getBudgetLimit from "../queries/getBudgetLimit";

export default function useBudgetLimit() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgetLimit"],
    queryFn: async () => getBudgetLimit(),
  });
  return { data, isLoading, error };
}
