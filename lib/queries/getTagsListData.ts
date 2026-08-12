import { createClient } from "@/lib/supabase/client";

export default async function getTagsListData() {
  const { data, error } = await createClient()
    .from("resource_tag_options")
    .select("team");
  const uniqueTags = Array.from(new Set(data?.map((item) => item.team)));
  return { data: uniqueTags, error };
}
