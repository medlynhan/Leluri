import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import AppError from "../errors";

interface InventoryFlags { hasProduct: boolean; hasClass: boolean; }

async function getInventoryFlags(user_id: string): Promise<InventoryFlags> {
  if (!user_id) return { hasProduct: false, hasClass: false };
  const { data: productCheck, error: productErr } = await supabase
    .from("product").select("id").eq("user_id", user_id).limit(1);
  if (productErr) throw new AppError(productErr.message, parseInt(productErr.code) || 500);
  const { data: classCheck, error: classErr } = await supabase
    .from("classes").select("id").eq("user_id", user_id).limit(1);
  if (classErr) throw new AppError(classErr.message, parseInt(classErr.code) || 500);
  return { hasProduct: !!productCheck && productCheck.length > 0, hasClass: !!classCheck && classCheck.length > 0 };
}

export function useGetInventoryFlags(user_id: string | undefined) {
  return useQuery<InventoryFlags, AppError>({
    queryKey: ["inventory-flags", user_id],
    queryFn: () => getInventoryFlags(user_id || ""),
    enabled: !!user_id,
  });
}
