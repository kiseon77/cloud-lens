import { useQuery } from "@tanstack/react-query";
import getServiceBreakdownChart from "../queries/getServiceBreakdownChart";

export default function useServiceBreakdownChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["serviceBreakdownChart"],
    queryFn: async () => getServiceBreakdownChart(),
  });
  return { data, isLoading, error };
}
