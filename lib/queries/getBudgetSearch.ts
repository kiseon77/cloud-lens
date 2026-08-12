import { supabase } from "@/lib/supabase/client";

export default async function getBudgetSearch(
  scopeType: string,
  scopeValue: string,
) {
  let query = supabase.from("budgets").select("*");

  if (scopeType) {
    query = query.eq(`scope_type`, scopeType.toLowerCase());
  }

  if (scopeValue) {
    query = query.eq(`scope_value`, scopeValue);
  }

  const { data, error } = await query.maybeSingle();
  return { data, error };
}
