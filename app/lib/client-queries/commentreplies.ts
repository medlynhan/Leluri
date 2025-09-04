import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { CommentRepliesWithUser, CommentReplyFormInput } from "../types/replies";
import { toast } from "sonner";
import AppError from "../errors";
import { AchievementRow, evaluateAchievements, recordAction } from "../achievements";

// get comment's replies
async function getCommentReplies(comment_id: string) : Promise<CommentRepliesWithUser[]> {
  const { data, error } = await supabase.from('comments_replies').select(`
    *,
    user:users ( id, username, role, image_url )
    `).eq("comment_id", comment_id)

  if (error) throw new Error(error.message);
  return data;
}

export function useGetCommentReplies(comment_id : string) {
  return useQuery<CommentRepliesWithUser[], Error>({
    queryKey: ["commentreplies", comment_id],
    queryFn: () => getCommentReplies(comment_id)
  });
}

// create new reply
async function createReply({
    reply,
    user_id,
    comment_id
} : CommentReplyFormInput) {
  const { data, error } = await supabase.from("comments_replies").insert([
      {
        user_id,
        reply,
        comment_id
      },
    ]);
  if (error) throw new AppError(error.message, parseInt(error.code) || 500);
  await recordAction(user_id, "comment", comment_id)
  return await evaluateAchievements(user_id)
}

export function useCreateReply() {
  const queryClient = useQueryClient();
  return useMutation<AchievementRow[], AppError, CommentReplyFormInput>({
    mutationFn: createReply,
    onSuccess: (data, variables) => {
      toast.success("New reply successfully added!")
      queryClient.invalidateQueries({ queryKey : ['commentreplies', variables.comment_id]});
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