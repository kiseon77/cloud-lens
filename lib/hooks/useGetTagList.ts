import { useQuery } from "@tanstack/react-query";
import getTagsListData from "../queries/getTagsListData";

export default function useGetTagList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tagList"],
    queryFn: async () => getTagsListData(),
  });
  return { data, isLoading, error };
}
