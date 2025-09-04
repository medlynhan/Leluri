import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "../supabase";
// import { UserProfile } from "../types/users";
import { ProfileState } from "@/(authenticated)/profile/[id]/page";

// get user by id
async function getUserProfileById(user_id: string|undefined): Promise<ProfileState> {

  const { data: userinfo, error: userInfoError } = await supabase
    .from('users')
    .select("*")
    .eq('id', user_id)
    .single();

  const { data: userachievement, error: userAchievementError } = await supabase
    .from('achievements')
    .select(`
      *,
      user_achievements ( user_id, unlocked_at )
      `)
    .eq("user_achievements.user_id", user_id)
  
  if (userInfoError) throw new Error(userInfoError.message);
  if (userAchievementError) throw new Error(userAchievementError.message);

  const finalUserProfile = {
    ...userinfo,
    achievements: userachievement
  }
  return finalUserProfile;
}

export function useGetUserProfileById(user_id : string|undefined, options?: UseQueryOptions<ProfileState>) {
  return useQuery<ProfileState, Error>({
    queryKey: ["profile", user_id],
    queryFn: () => getUserProfileById(user_id),
    enabled: !!user_id,
    ...options,
  });
}