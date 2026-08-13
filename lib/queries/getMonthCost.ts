import { createClient } from "@/lib/supabase/client";

export default async function getMonthCost({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const { data: totalCost, error } = await createClient().rpc(
    "get_total_resource_cost",
    {
      start_date: start,
      end_date: end,
    },
  );

  return { data: totalCost, error };
}
