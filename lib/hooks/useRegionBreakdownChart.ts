import { useQuery } from "@tanstack/react-query";
import getRegionBreakdownChart from "../queries/getRegionBreakdownChart";

export default function useRegionBreakdownChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["regionBreakdownChart"],
    queryFn: async () => getRegionBreakdownChart(),
  });
  return { data, isLoading, error };
}
