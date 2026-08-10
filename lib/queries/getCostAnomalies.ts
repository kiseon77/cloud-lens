import { supabase } from "@/lib/supabase/client";

export default async function getCostAnomalies() {
  const { data: totalCost, error } = await supabase.rpc("get_cost_anomalies");
  return { data: totalCost, error };
}
