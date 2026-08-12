import { createClient } from "@/lib/supabase/client";

export default async function postAddAlertRule(payload) {
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
