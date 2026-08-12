import { supabase } from "@/lib/supabase/client";

export default async function updateBudget({ id, ...payload }) {
  const { data, error } = await supabase
    .from("budgets")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data, error };
}
