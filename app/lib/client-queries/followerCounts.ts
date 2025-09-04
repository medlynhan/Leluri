import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import AppError from "../errors";

export interface FollowerCounts { followerCount: number; followingCount: number; }

async function getFollowerCounts(user_id: string): Promise<FollowerCounts> {
  if (!user_id) return { followerCount: 0, followingCount: 0 };
  const { count: followerCount, error: followersErr } = await supabase
    .from('userfollowers')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', user_id);
  if (followersErr) throw new AppError(followersErr.message, parseInt(followersErr.code) || 500);
  const { count: followingCount, error: followingErr } = await supabase
    .from('userfollowers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', user_id);
  if (followingErr) throw new AppError(followingErr.message, parseInt(followingErr.code) || 500);
  return { followerCount: followerCount || 0, followingCount: followingCount || 0 };
}

export function useGetFollowerCounts(user_id: string | undefined) {
  return useQuery<FollowerCounts, AppError>({
    queryKey: ["follower-counts", user_id],
    queryFn: () => getFollowerCounts(user_id || ""),
    enabled: !!user_id,
  });
}
