import { createClient } from "@/lib/supabase/client";
import { AlertRulePayload } from "@/lib/postType";

export default async function postAddAlertRule(payload: AlertRulePayload) {
  const { data, error } = await createClient()
    .from("alert_rules")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
