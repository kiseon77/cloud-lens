import { supabase } from "@/lib/supabase/client";

export default async function getAlertRule(budgetId) {
  if (!budgetId) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("alert_rules")
    .select("*")
    .eq("budget_id", budgetId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
