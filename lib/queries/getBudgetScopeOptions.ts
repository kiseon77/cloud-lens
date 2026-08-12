import { supabase } from "@/lib/supabase/client";

export default async function getBudgetScopeOptions(
  scopeType: "TEAM" | "PROJECT",
) {
  const { data, error } = await supabase.rpc("get_budget_scope_options", {
    p_scope_type: scopeType,
  });
  if (error) throw error;
  return data;
}
