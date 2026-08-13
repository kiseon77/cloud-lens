import { createClient } from "@/lib/supabase/client";

export default async function getBudgetLimit() {
  const query = createClient()
    .from("budgets")
    .select("scope_value, monthly_limit, current_spend, threshold_percent");

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
