import { useQuery } from "@tanstack/react-query";
import getBudgetListData from "../queries/getBudgetListData";

export default function useGetBudgetList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["budgetData"],
    queryFn: async () => getBudgetListData(1, 10),
  });
  return { data, isLoading, error };
}
