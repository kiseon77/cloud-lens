import { createClient } from "@/lib/supabase/client";

export default async function getCostAnomalies() {
  const { data: totalCost, error } =
    await createClient().rpc("get_cost_anomalies");

  if (error) {
    throw new Error(error.message);
  }

  return { data: totalCost, error };
}
