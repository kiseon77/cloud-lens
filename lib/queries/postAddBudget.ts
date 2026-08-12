import { supabase } from "@/lib/supabase/client";

export default async function postAddBudget(payload) {
  const { data, error } = await supabase
    .from("budgets")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
}
