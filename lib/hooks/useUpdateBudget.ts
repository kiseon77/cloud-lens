import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateBudget from "../queries/updateBudget";

export default function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetData"] });
      queryClient.invalidateQueries({ queryKey: ["budgetSearchData"] });
      queryClient.invalidateQueries({ queryKey: ["budgetLimit"] });
    },
  });
}
