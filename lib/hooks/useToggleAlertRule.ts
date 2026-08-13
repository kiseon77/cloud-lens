import { useMutation, useQueryClient } from "@tanstack/react-query";
import toggleAlertRuleActive from "../queries/toggleAlertRuleActive";

interface AlertRuleListItem {
  id: string | number;
  is_active: boolean;
  [key: string]: unknown;
}

interface RuleListCache {
  data: AlertRuleListItem[] | null;
  [key: string]: unknown;
}

export default function useToggleAlertRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAlertRuleActive,
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["ruleData"] });
      const previous = queryClient.getQueryData(["ruleData"]);

      queryClient.setQueryData<RuleListCache>(["ruleData"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((rule) =>
            rule.id === id ? { ...rule, is_active } : rule,
          ),
        };
      });

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["ruleData"], context.previous);
      }
      alert(`상태 변경 중 오류가 발생했습니다: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ruleData"] });
      queryClient.invalidateQueries({ queryKey: ["alertRule"] });
    },
  });
}
