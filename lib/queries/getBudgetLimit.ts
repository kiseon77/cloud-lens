import { supabase } from "@/lib/supabase/client";

export default async function getBudgetLimit() {
  const query = supabase
    .from("budgets")
    .select("scope_value, monthly_limit, current_spend, threshold_percent");

  const { data, error } = await query;

  return { data, error };
}
