import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";

// create a post like
async function createPostLike({ user_id, post_id }: { user_id: string; post_id: string }) {
  const { error } = await supabase.from("posts_likes").insert([{ user_id, post_id }]);
  if (error) throw new AppError(error.message, parseInt(error.code) || 500)
  return { user_id, post_id };
}

export function useCreatePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostLike,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      toast.success("Liked post!");
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
  return { user_id, post_id };
}

export function useDeletePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostLike,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
      toast.success("Unliked post!");
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
