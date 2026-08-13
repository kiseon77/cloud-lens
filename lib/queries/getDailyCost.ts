import { createClient } from "@/lib/supabase/client";

export default async function getCostTrend({ daysBack = 30 }) {
  const { data, error } = await createClient().rpc("get_cost_trend", {
    days_back: daysBack,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
