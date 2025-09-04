import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { AchievementRow, evaluateAchievements, recordAction } from "../achievements";
import AppError from "../errors";

interface UserFollowerFormInput {
  follower_id: string; 
  followed_id: string;
}

// create new user follower
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

// delete user follower
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
