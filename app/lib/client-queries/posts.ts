import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { DetailedPostWithMedia, PostInput } from "../types/posts";
import { toast } from 'sonner'
import AppError from "../errors";

// get all posts
async function getPosts(user_id : string): Promise<DetailedPostWithMedia[]> {

  const { data: posts, error: postsError } = await supabase.from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*),
      posts_likes!fk_postlike_post ( user_id )
      `)
  // Show latest posts first
  .order("created_at", { ascending: false })
    
  const { data: followedByUser = [], error: followedByUserError } = await supabase.from('userfollowers')
    .select(`*`)
    .eq("follower_id", user_id)

  if (postsError) throw new Error(postsError.message);
  if (followedByUserError) throw new Error(followedByUserError.message);

  const finalPosts = posts.map((post) => ({
    ...post,
    user: {
      ...post?.user,
      followed: followedByUser?.some((followed: any) => followed.followed_id === post.user.id)
    },
    liked: post.posts_likes.some((like: any) => like.user_id === user_id)
  }));
  // console.log(finalPosts)
  return finalPosts
}

export function useGetPosts(user_id : string|undefined, options?: UseQueryOptions<DetailedPostWithMedia[]>) {
  return useQuery<DetailedPostWithMedia[]>({
    queryKey: ["posts", user_id],
    queryFn: () => getPosts(user_id ?? ''),
    enabled: !!user_id,
    ...options,
  });
}

// get post by id
// get post by id
async function getPostById(post_id: string, user_id?: string): Promise<DetailedPostWithMedia & { liked: boolean; likes: number }> {
  const { data: post, error } = await supabase.from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*),
      posts_likes!fk_postlike_post ( user_id )
    `)
    .eq('id', post_id)
    .single();

  if (error) throw new Error(error.message);

  return {
    ...post,
    liked: post.posts_likes?.some((like: any) => like.user_id === user_id) ?? false,
    likes: post.posts_likes?.length ?? 0
  }
}

export function useGetPostById(post_id: string, user_id?: string) {
  return useQuery({
    queryKey: ["post", post_id, user_id],
    queryFn: () => getPostById(post_id, user_id),
    enabled: !!post_id
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
  const fileExt = posts_media[0].name.split(".").pop()?.toLowerCase();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user_id}/${fileName}`;

    let mediaType: "image" | "video" = "image";
    if (!fileExt) throw new AppError("Unable to detect file extension", 400)
    if (["jpg","jpeg","png","gif","bmp","webp","avif"].includes(fileExt)) {
      mediaType = "image"
    } else if (["mp4","avi","mov","mkv","webm"].includes(fileExt)) {
      mediaType = "video"
    } else {
      throw new AppError("Unsupported file type", 400)
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
        media_url: publicUrl.trim(),
        is_main: true,
        created_at: new Date().toISOString()
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

// get post by id
async function getPostByUserId(user_id: string|undefined): Promise<DetailedPostWithMedia[]> {
  const { data, error } = await supabase.from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*)
      `)
    .eq('user_id', user_id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export function useGetPostByUserId(user_id : string|undefined, options?: UseQueryOptions<DetailedPostWithMedia[]>) {
  return useQuery<DetailedPostWithMedia[], Error>({
    queryKey: ["user-posts", user_id],
    queryFn: () => getPostByUserId(user_id),
    enabled: !!user_id,
    ...options
  });
}



// get all posts (hanya dari user yang difollow)
async function getFollowedPosts(user_id : string): Promise<DetailedPostWithMedia[]> {

  // cari siapa saja yang di-follow user ini
  const { data: followedByUser = [], error: followedByUserError } = await supabase
    .from("userfollowers")
    .select("followed_id")
    .eq("follower_id", user_id);

  if (followedByUserError) throw new Error(followedByUserError.message);

  const followedIds = (followedByUser ?? []).map((f) => f.followed_id);

  if (followedIds.length === 0) {
    // kalau user belum follow siapa pun, beranda kosong
    return [];
  }

  // ambil post hanya dari user yang difollow
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(`
      *,
      user:users!posts_user_id_fkey ( id, username, image_url, role ),
      posts_media (*),
      posts_likes!fk_postlike_post ( user_id )
    `)
    .in("user_id", followedIds) // <-- filter di sini
    .order("created_at", { ascending: false });

  if (postsError) throw new Error(postsError.message);

  const finalPosts = posts.map((post) => ({
    ...post,
    user: {
      ...post?.user,
      followed: followedIds.includes(post.user.id), // karena pasti difollow
    },
    liked: post.posts_likes.some((like: any) => like.user_id === user_id),
  }));

  return finalPosts;
}

export function useGetFollowedPosts(user_id: string | undefined, options?: UseQueryOptions<DetailedPostWithMedia[]>) {
  return useQuery<DetailedPostWithMedia[], Error>({
    queryKey: ["followed-posts", user_id],
    queryFn: () => getFollowedPosts(user_id as string),
    enabled: !!user_id,
    ...options,
  });
}
