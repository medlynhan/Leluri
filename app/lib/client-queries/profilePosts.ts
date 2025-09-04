import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { DetailedPostWithMedia } from "../types/posts";
import AppError from "../errors";

async function getProfilePosts(user_id: string): Promise<DetailedPostWithMedia[]> {
  if (!user_id) return [];
  const { data, error } = await supabase
    .from("posts")
    .select(`*, posts_media(*), user:users!posts_user_id_fkey(id, username, image_url, role)`)
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw new AppError(error.message, parseInt(error.code) || 500);
  return data as DetailedPostWithMedia[];
}

export function useGetProfilePosts(user_id: string | undefined) {
  return useQuery<DetailedPostWithMedia[], AppError>({
    queryKey: ["profile-posts", user_id],
    queryFn: () => getProfilePosts(user_id || ""),
    enabled: !!user_id,
  });
}
