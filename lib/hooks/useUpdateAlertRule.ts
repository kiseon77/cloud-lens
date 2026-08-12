import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateAlertRule from "@/lib/queries/updateAlertRule";

export default function useUpdateAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAlertRule,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ruleList"] });
      queryClient.invalidateQueries({ queryKey: ["alertRule"] });
    },
  });
}
