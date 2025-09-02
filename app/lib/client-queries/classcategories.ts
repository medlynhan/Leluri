import { useQuery } from "@tanstack/react-query";
import { Category } from "../types";
import { supabase } from "../supabase";

async function getClassCategories() {
  const { data, error } = await supabase.from('classcategories').select("id, name")
  if (error) throw new Error(error.message);
  return data;
}

export function useGetClassCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["classcategories"],
    queryFn: getClassCategories,
  });
}