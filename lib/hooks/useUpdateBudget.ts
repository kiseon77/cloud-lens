import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateBudget from "../queries/updateBudget";

export default function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetList"] });
      queryClient.invalidateQueries({ queryKey: ["budgetSearch"] });
    },
  });
}
