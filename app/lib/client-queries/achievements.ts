import { useQuery } from "@tanstack/react-query";
import { fetchUnlockedAchievements, evaluateAchievements, AchievementRow } from "../achievements";

interface AchievementResult { achievements: AchievementRow[]; newlyUnlocked: AchievementRow[]; }

async function getAchievements(user_id: string): Promise<AchievementResult> {
  if (!user_id) return { achievements: [], newlyUnlocked: [] };
  const unlocked = await fetchUnlockedAchievements(user_id);
  const newly = await evaluateAchievements(user_id);
  const merged = [...unlocked];
  const newIds = new Set(unlocked.map(a => a.id));
  newly.forEach(a => { if (!newIds.has(a.id)) merged.push(a); });
  return { achievements: merged, newlyUnlocked: newly };
}

export function useGetAchievements(user_id: string | undefined) {
  return useQuery<AchievementResult>({
    queryKey: ["achievements", user_id],
    queryFn: () => getAchievements(user_id || ""),
    enabled: !!user_id,
  });
}
