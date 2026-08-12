import { useMutation, useQueryClient } from "@tanstack/react-query";
import postAddAlertRule from "../queries/postAddAlertRule";

export default function useAddAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAddAlertRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ruleList"] });
      queryClient.invalidateQueries({ queryKey: ["alertRule"] });
    },
  });
}
