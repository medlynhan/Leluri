import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { AchievementRow, evaluateAchievements, recordAction } from "../achievements";
import AppError from "../errors";

interface PostLikeFormInput {
  user_id: string; 
  post_id: string;
}

// create a post like
async function createPostLike({ 
  user_id, 
  post_id 
} : PostLikeFormInput) : Promise<AchievementRow[]> {
  const { error } = await supabase.from("posts_likes").insert([{ user_id, post_id }]);
  if (error) throw new AppError(error.message, parseInt(error.code) || 500)
  await recordAction(user_id, "like_post")
  return await evaluateAchievements(user_id)
}

export function useCreatePostLike() {
  const queryClient = useQueryClient();
  return useMutation<AchievementRow[], AppError, PostLikeFormInput>({
    mutationFn: createPostLike,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      toast.success("You liked the post!");
      return data
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

// delete a post like
async function deletePostLike({ user_id, post_id }: { user_id: string; post_id: string }) {
  const { error } = await supabase
    .from("posts_likes")
    .delete()
    .eq("user_id", user_id)
    .eq("post_id", post_id);
  if(error) throw new AppError(error.message, parseInt(error.code) || 500);
}

export function useDeletePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostLike,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      toast.success("You unliked the post!");
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
