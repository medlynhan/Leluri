import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { UserRole } from "../types";

// get all user roles
async function getUserRoles(): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`*`);

  if (error) throw new Error(error.message);
  return data;
}

export function useGetUserRoles() {
  return useQuery<UserRole[], Error>({
    queryKey: ["user_roles"],
    queryFn: getUserRoles,
  });
}
