import { createClient } from "@/lib/supabase/client";

export default async function updateAlertRule({ id, ...payload }) {
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
