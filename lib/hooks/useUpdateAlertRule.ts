import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateAlertRule from "@/lib/queries/updateAlertRule";

export default function useUpdateAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAlertRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ruleData"] });
      queryClient.invalidateQueries({ queryKey: ["alertRule"] });
    },
  });
}
