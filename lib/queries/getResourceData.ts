import { createClient } from "@/lib/supabase/client";

export default async function getResourceData(
  page: number,
  pageSize: number,
  handleDebounce: string,
  serviceFilter: string,
  regionFilter: string,
  tagFilter: string,
) {
  let query = createClient()
    .from("resource_costs")
    .select("*", { count: "exact" });

  if (handleDebounce) {
    query = query.ilike(`resource_name`, `%${handleDebounce}%`);
  }

  if (serviceFilter) {
    query = query.eq(`service`, serviceFilter);
  }

  if (regionFilter) {
    query = query.eq(`region`, regionFilter);
  }

  if (tagFilter) {
    query = query.eq(`tags->>Team`, tagFilter);
  }

  const { data, count, error } = await query.range(
    Math.max(0, (page - 1) * pageSize),
    Math.max(0, (page - 1) * pageSize) + pageSize - 1,
  );

  query = query.order("created_at", { ascending: false });

  return { data, count, error };
}
