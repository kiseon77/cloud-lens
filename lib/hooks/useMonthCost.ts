import { useQuery } from "@tanstack/react-query";
import getMonthCost from "../queries/getMonthCost";
import { useMonthCalculation } from "./useMonthCalculation";

export default function useMonthCost({
  getMonthNumber,
}: {
  getMonthNumber: number;
}) {
  const { start, end } = useMonthCalculation(getMonthNumber);

  const { data, isLoading, error } = useQuery({
    queryKey: ["monthCost", start, end],
    queryFn: async () => getMonthCost({ start, end }),
  });
  return { data, isLoading, error };
}
