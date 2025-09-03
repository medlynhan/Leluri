import { useQuery } from "@tanstack/react-query";
import { Category } from "../types";
import { supabase } from "../supabase";

async function getPostCategories() {
  const { data, error } = await supabase.from('postcategories').select("id, name")
  if (error) throw new Error(error.message);
  return data;
}

export function useGetPostCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["postcategories"],
    queryFn: getPostCategories,
  });
}