import { createClient } from "@/lib/supabase/client";

export default async function toggleAlertRuleActive({ id, is_active }) {
  const { data, error } = await createClient()
    .from("alert_rules")
    .update({ is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
