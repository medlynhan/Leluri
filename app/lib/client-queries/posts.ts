import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { DetailedPostWithMedia, PostInput } from "../types/posts";
import { toast } from 'sonner'

// get all posts
async function getPosts(): Promise<DetailedPostWithMedia[]> {
  const { data, error } = await supabase.from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*)
    `)
  if (error) throw new Error(error.message);
  return data;
}

export function useGetPosts() {
  return useQuery<DetailedPostWithMedia[], Error>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
}

// get post by id
async function getPostById(post_id: string): Promise<DetailedPostWithMedia> {
  const { data, error } = await supabase.from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*)
      `)
    .eq('id', post_id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function useGetPostById(post_id: string) {
  return useQuery<DetailedPostWithMedia, Error>({
    queryKey: ["post", post_id],
    queryFn: () => getPostById(post_id),
  });
}

// create new post
async function createPost({
  posts_media,
  user_id,
  description,
  category_id,
  title,
}: PostInput) {
  try {
    const fileExt = posts_media[0].name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user_id}/${fileName}`;

    let mediaType: "image" | "video" = "image";
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExt)) {
      mediaType = "image";
    } else if (["mp4", "avi", "mov", "mkv", "webm"].includes(fileExt)) {
      mediaType = "video";
    } else {
      throw new AppError("Unsupported file type", 400);
    }

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, posts_media[0]);
    if (uploadError){
      throw new AppError(uploadError.message, 500);
    }

    const { data: { publicUrl } } = supabase.storage
      .from("posts")
      .getPublicUrl(filePath);

    const { data, error: insertPostError } = await supabase.from("posts").insert([
      {
        user_id,
        title,
        description,
        category_id,
      },
    ]).select("id");

    if (insertPostError){

      throw new AppError(insertPostError.message, parseInt(insertPostError.code) || 500)
    };

    const { error: insertPostMediaError } = await supabase.from("posts_media").insert([
      {
        post_id: data[0].id,
        media_type: mediaType,
        media_url: publicUrl,
        is_main: true,
      }
    ])

    if (insertPostMediaError) throw new AppError(insertPostMediaError.message, parseInt(insertPostMediaError.code) || 500);

    return { publicUrl, filePath };
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(err.message ?? "Unexpected error", err.status ?? 500);
  }
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post successfully created!")
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