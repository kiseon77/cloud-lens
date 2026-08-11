import { supabase } from "@/lib/supabase/client";

export default async function getRegionBreakdownChart() {
  const query = supabase.rpc("get_region_costs");

  const { data, error } = await query;

  return { data, error };
}
