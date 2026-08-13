import { createClient } from "@/lib/supabase/client";

export default async function getRegionBreakdownChart() {
  const query = createClient().rpc("get_region_costs");

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
