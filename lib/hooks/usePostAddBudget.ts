// lib/hooks/useAddBudget.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postAddBudget from "../queries/postAddBudget";
import { BudgetPayload } from "../postType";

export default function useAddBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBudget: BudgetPayload) => postAddBudget(newBudget),
    onSuccess: (data) => {
      console.log("예산 등록 성공:", data);
      queryClient.invalidateQueries({ queryKey: ["budgetSearchData"] });
    },

    onError: (error) => {
      console.error("예산 등록 실패:", error.message);
    },
  });
}
