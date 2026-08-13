import { createClient } from "@/lib/supabase/client";
import { BudgetUpdatePayload } from "@/lib/postType";

export default async function updateBudget({
  id,
  ...payload
}: BudgetUpdatePayload) {
  const { data, error } = await createClient()
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
