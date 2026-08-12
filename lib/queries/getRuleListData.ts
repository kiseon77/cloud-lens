import { createClient } from "@/lib/supabase/client";

export default async function getRuleListData(page: number, pageSize: number) {
  let query = createClient()
    .from("alert_rules")
    .select("*", { count: "exact" });

  const { data, count, error } = await query.range(
    Math.max(0, (page - 1) * pageSize),
    Math.max(0, (page - 1) * pageSize) + pageSize - 1,
  );

  query = query.order("created_at", { ascending: false });

  return { data, count, error };
}
