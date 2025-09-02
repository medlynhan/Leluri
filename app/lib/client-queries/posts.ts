import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Post } from "../types";
import { supabaseClient } from "../supabaseClient";

// get all posts information
async function getPosts() {
  const { data, error } = await supabaseClient.from('posts').select("*")
  if (error) throw new Error(error.message);
  return data;
}

export function useGetPosts() {
  return useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
}