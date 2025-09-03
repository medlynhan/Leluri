import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { ClassMenteeInput } from "../types/classmentees";

// create new class mentee
async function createClassMentee({
  user_id,
  class_id,
  notes,
} : ClassMenteeInput) {
  try {
    const { data, error } = await supabase.from("class_mentees").insert([
      {
        user_id,
        class_id,
        notes
      },
    ]).select("id");

    if (error) throw new AppError(error.message, parseInt(error.code) || 500);

    return data[0];
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError(err.message ?? "Unexpected error", err.status ?? 500);
  }
}

export function useCreateClassMentee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClassMentee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classmentees"] });
      toast.success("Mentee successfully added!");
    },
    onError: (err: any) => {
      if (err instanceof AppError) {
        toast.error(`${err.status} : ${err.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
}
