import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import AppError from "../errors";

export interface ProfileData {
  id: string;
  username: string;
  role: string;
  biography: string | null;
  location: string | null;
  image_url: string | null;
  phone_number: string | null;
}

async function getProfile(user_id: string): Promise<ProfileData | null> {
  if (!user_id) return null;
  const { data, error } = await supabase
    .from("users")
    .select("id, username, role, biography, location, image_url, phone_number")
    .eq("id", user_id)
    .maybeSingle();
  if (error) throw new AppError(error.message, parseInt(error.code) || 500);
  return data as ProfileData | null;
}

export function useGetProfile(user_id: string | undefined) {
  return useQuery<ProfileData | null, AppError>({
    queryKey: ["profile", user_id],
    queryFn: () => getProfile(user_id || ""),
    enabled: !!user_id,
  });
}

interface UpdateProfileInput {
  user_id: string;
  username: string;
  role: string;
  biography: string | null;
  location: string | null;
  phone_number: string | null;
  avatarFile?: File | null;
}

async function updateProfile(input: UpdateProfileInput): Promise<ProfileData> {
  const { user_id, avatarFile } = input;
  let image_url: string | null = null;

  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user_id}.${fileExt}`;
    const filePath = fileName;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });
    if (uploadError)
      throw new AppError(uploadError.message, 500);
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    image_url = publicUrl;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      username: input.username,
      role: input.role,
      biography: input.biography,
      location: input.location,
      phone_number: input.phone_number,
      ...(image_url ? { image_url } : {}),
    })
    .eq("id", user_id);
  if (updateError)
    throw new AppError(updateError.message, parseInt(updateError.code) || 500);

  const fresh = await getProfile(user_id);
  if (!fresh) throw new AppError("Profile not found after update", 404);
  return fresh;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      qc.setQueryData(["profile", data.id], data);
    },
  });
}
