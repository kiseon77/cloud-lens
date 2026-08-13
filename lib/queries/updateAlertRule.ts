import { createClient } from "@/lib/supabase/client";
import { AlertRuleUpdatePayload } from "@/lib/postType";

export default async function updateAlertRule({
  id,
  ...payload
}: AlertRuleUpdatePayload) {
  const { data, error } = await createClient()
    .from("alert_rules")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
