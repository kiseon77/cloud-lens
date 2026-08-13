import { createClient } from "@/lib/supabase/client";
import { BudgetPayload } from "@/lib/postType";

export default async function postAddBudget(payload: BudgetPayload) {
  const { data, error } = await createClient()
    .from("budgets")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return { data, error };
}
