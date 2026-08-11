import { supabase } from "@/lib/supabase/client";

export default async function getServiceBreakdownChart() {
  const query = supabase.rpc("get_service_costs");

  const { data, error } = await query;

  return { data, error };
}
