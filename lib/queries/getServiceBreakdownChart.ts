import { createClient } from "@/lib/supabase/client";

export default async function getServiceBreakdownChart() {
  const query = createClient().rpc("get_service_costs");

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
