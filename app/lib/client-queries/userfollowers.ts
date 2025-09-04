import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { AchievementRow, evaluateAchievements, recordAction } from "../achievements";
import AppError from "../errors";

interface UserFollowerFormInput {
  follower_id: string; 
  followed_id: string;
}

async function createUserFollower({ 
  follower_id, 
  followed_id 
} : UserFollowerFormInput) : Promise<AchievementRow[]> {
  const { error } = await supabase.from("userfollowers").insert([{ follower_id, followed_id }]);
  if (error) throw new AppError(error.message, parseInt(error.code) || 500)
  await recordAction(follower_id, "follow", followed_id)
  return await evaluateAchievements(follower_id)
}

export function useCreateUserFollower() {
  const queryClient = useQueryClient();
  return useMutation<AchievementRow[], AppError, UserFollowerFormInput>({
    mutationFn: createUserFollower,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.follower_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.followed_id] });
      toast.success(`You have followed a user!`);
      return data
    },
    onError: (err) => {
      if (err instanceof AppError) {
        toast.error(`${err.status} : ${err.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

async function deleteUserFollower({ 
  follower_id, 
  followed_id 
} : UserFollowerFormInput) {
  const { error } = await supabase
    .from("userfollowers")
    .delete()
    .eq("follower_id", follower_id)
    .eq("followed_id", followed_id);
  if(error) throw new AppError(error.message, parseInt(error.code) || 500);
}

export function useDeleteUserFollower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserFollower,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.follower_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.followed_id] });
      toast.success(`You have unfollowed a user!`);
    },
    onError: (err: any) => {
      if (err instanceof AppError) {
        toast.error(`${err.status} : ${err.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}

interface BasicUser { id: string; username: string; image_url: string|null; role: string|null }

async function fetchUsersByRelation(params: { targetUserId: string; mode: 'followers'|'following'; limit: number; page: number; }): Promise<BasicUser[]> {
  const { targetUserId, mode, limit, page } = params;
  if (!targetUserId) return [];
  const from = page * limit;
  const to = from + limit - 1;

  const matchColumn = mode === 'followers' ? 'followed_id' : 'follower_id';
  const idColumnToExtract = mode === 'followers' ? 'follower_id' : 'followed_id';

  const { data: relRows, error: relErr } = await supabase
    .from('userfollowers')
    .select(`${idColumnToExtract}`)
    .eq(matchColumn, targetUserId)
    .range(from, to);
  if (relErr) throw new AppError(relErr.message, parseInt(relErr.code) || 500);
  const ids = (relRows || []).map(r => (r as any)[idColumnToExtract] as string).filter(Boolean);
  if (!ids.length) return [];

  const { data: users, error: usersErr } = await supabase
    .from('users')
    .select('id, username, image_url, role')
    .in('id', ids);
  if (usersErr) throw new AppError(usersErr.message, parseInt(usersErr.code) || 500);
  const map: Record<string, BasicUser> = {};
  users.forEach(u => { map[u.id] = u as BasicUser; });
  return ids.map(id => map[id]).filter(Boolean);
}

export function useGetFollowers(user_id: string|undefined, opts?: { limit?: number; page?: number }){
  const limit = opts?.limit ?? 30;
  const page = opts?.page ?? 0;
  return useQuery<BasicUser[], AppError>({
    queryKey: ['followers', user_id, limit, page],
    queryFn: () => fetchUsersByRelation({ targetUserId: user_id || '', mode: 'followers', limit, page }),
    enabled: !!user_id,
  });
}

export function useGetFollowing(user_id: string|undefined, opts?: { limit?: number; page?: number }){
  const limit = opts?.limit ?? 30;
  const page = opts?.page ?? 0;
  return useQuery<BasicUser[], AppError>({
    queryKey: ['following', user_id, limit, page],
    queryFn: () => fetchUsersByRelation({ targetUserId: user_id || '', mode: 'following', limit, page }),
    enabled: !!user_id,
  });
}
