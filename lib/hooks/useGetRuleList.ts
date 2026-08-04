import { useQuery } from "@tanstack/react-query";
import getRuleListData from "../queries/getRuleListData";

export default function useGetRuleList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ruleData"],
    queryFn: async () => getRuleListData(1, 10),
  });
  return { data, isLoading, error };
}
