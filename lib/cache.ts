import { supabase } from "@/lib/supabase";

const LEADERBOARD_ID = "main";

export async function readLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("data")
    .eq("id", LEADERBOARD_ID)
    .single();

  if (error) return [];

  return data?.data ?? [];
}

export async function saveLeaderboard(leaderboardData: any) {
  const { error } = await supabase.from("leaderboard").upsert({
    id: LEADERBOARD_ID,
    data: leaderboardData,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}