import { useQuery, keepPreviousData } from "@tanstack/react-query";
import getResourceData from "../queries/getResourceData";

export default function useResourceData(
  page: number,
  pageSize: number,
  handleDebounce: string,
  serviceFilter: string,
  regionFilter: string,
  tagFilter: string,
) {
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "resourceData",
      page,
      pageSize,
      handleDebounce,
      serviceFilter,
      regionFilter,
      tagFilter,
    ],
    queryFn: async () =>
      getResourceData(
        page,
        pageSize,
        handleDebounce,
        serviceFilter,
        regionFilter,
        tagFilter,
      ),
    placeholderData: keepPreviousData,
  });
  return { data, isLoading, error };
}
