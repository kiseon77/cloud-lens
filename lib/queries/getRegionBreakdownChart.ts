import { createClient } from "@/lib/supabase/client";

export default async function getRegionBreakdownChart() {
  const query = createClient().rpc("get_region_costs");

  const { data, error } = await query;

  return { data, error };
}
