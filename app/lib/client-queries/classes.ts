import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { ClassWithCreator } from "../types/class";

async function getClasses() : Promise<ClassWithCreator[]> {
  const { data, error } = await supabase.from('classes').select(`
    *,
    creator:users ( id, username, role, image_url )
    `)
  if (error) throw new Error(error.message);
  return data;
}

export function useGetClasses() {
  return useQuery<ClassWithCreator[], Error>({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
}