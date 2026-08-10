import { useQuery } from "@tanstack/react-query";
import getCostAnomalies from "../queries/getCostAnomalies";

export default function useCostAnomalies() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["costAnomalies"],
    queryFn: async () => getCostAnomalies(),
  });
  return { data, isLoading, error };
}
