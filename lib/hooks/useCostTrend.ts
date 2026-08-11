import { useQuery } from "@tanstack/react-query";
import getCostTrend from "../queries/getDailyCost";

export default function useCostTrend() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["costTrend"],
    queryFn: async () => getCostTrend({ daysBack: 30 }),
  });
  return { data, isLoading, error };
}
