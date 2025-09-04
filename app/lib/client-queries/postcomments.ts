import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { PostCommentFormInput, PostCommentWithUser } from "../types/comments";
import { toast } from "sonner";
import { DetailedPostWithMedia } from "../types/posts";
import AppError from "../errors";
import { AchievementRow, evaluateAchievements, recordAction } from "../achievements";

// get all comments
async function getPostComments(post_id: string) : Promise<PostCommentWithUser[]> {
  const { data, error } = await supabase.from('posts_comments').select(`
    *,
    user:users ( id, username, role, image_url )
    `).eq("post_id", post_id)

  if (error) throw new Error(error.message);
  return data;
}

export function useGetPostComments(post_id : string) {
  return useQuery<PostCommentWithUser[], Error>({
    queryKey: ["postcomments", post_id],
    queryFn: () => getPostComments(post_id)
  });
}

// create new comment
async function createComment({
    comment,
    user_id,
    post_id
} : PostCommentFormInput) {
  const { data, error } = await supabase.from("posts_comments").insert([
      {
        user_id,
        comment,
        post_id
      },
    ]);
  await recordAction(user_id, "comment", post_id)
  if (error) throw new AppError(error.message, parseInt(error.code) || 500);
  return await evaluateAchievements(user_id);
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation<AchievementRow[], AppError, PostCommentFormInput>({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      toast.success("New comment successfully added!")
      queryClient.invalidateQueries({ queryKey : ['postcomments', variables.post_id]});
      queryClient.invalidateQueries({ queryKey : ['posts', variables.user_id]})
      return data
    },
    onError: (err: any) => {
      if (err instanceof AppError) {
        toast.error(`${err.status} : ${err.message}`);
      } else {
        toast.error('An unexpected error occurred.');
      }
    },
  });
}