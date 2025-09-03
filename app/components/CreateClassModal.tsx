import { AchievementRow, evaluateAchievements, recordAction } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useState } from "react";

const CreateClassModal = () => {

  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [newClassName, setNewClassName] = useState('')
  const [newClassDescription, setNewClassDescription] = useState('')
  const [creatingType, setCreatingType] = useState<'product' | 'class' | null>(null)
  const [savingNew, setSavingNew] = useState(false)
  const [hasClass, setHasClass] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [hasProduct, setHasProduct] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [achievements, setAchievements] = useState<AchievementRow[]>([])
  const [unlockQueue, setUnlockQueue] = useState<AchievementRow[]>([])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Kelas Baru</h2>
      {/* form */}
      <div className="space-y-4 text-sm">
        {/* image */}
        <div> 
          <label className="block font-medium text-[var(--black)] mb-1">Gambar Kelas</label>
          <div className="flex items-center gap-3">
            <div className="w-25 h-25 rounded-lg border flex items-center justify-center overflow-hidden bg-[var(--light-grey)] text-(var[--dark-grey])">
              {newProductImageFile ? (
                <Image
                  src={URL.createObjectURL(newProductImageFile)}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              ) : (
                <p>Preview</p>
              )}
            </div>
            <label className="px-3 py-2 border rounded-full cursor-pointer hover:bg-[var(--light-grey)]">
              Pilih File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    console.log("File dipilih:", e.target.files[0]);
                    setNewProductImageFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* title */}
        <div>
          <label className="block font-medium text-[var(--black)] mb-1">Nama / Judul Kelas</label>
          <input
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: Belajar Batik"
          />
        </div>

        {/* deskripsi kelas */}
        <div>
          <label className="block font-medium text-[var(--black)] mb-1">
            Deskripsi
          </label>
          <textarea
            value={newClassDescription}
            onChange={(e) => setNewClassDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24"
            placeholder="Jelaskan kelas kamu"
          />
        </div>
      </div>

      {/* button submit */}
      <div className="flex gap-3 mt-6 text-sm">
        <button
          onClick={() => setCreatingType(null)}
          type="button"
          className="flex-1 border rounded-full py-2 hover:bg-[var(--light-grey)]"
        >
          Kembali
        </button>
  
        <button
          disabled={savingNew || !newProductImageFile || !newClassName}
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            if (!user || !newProductImageFile) return;
            setSavingNew(true);
  
            try {
              console.log("Menyimpan kelas baru...");
  
              const bucket = "classes";
              const ext = newProductImageFile.name.split(".").pop();
              const fileName = `${user.id}-${Date.now()}.${ext}`;
  
              // Upload ke storage
              const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, newProductImageFile);
  
              if (uploadError) throw uploadError;
  
              // Ambil public URL
              const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);
  
              // Insert ke tabel
              const { data, error: insertError } = await supabase
                .from("classes")
                .insert({
                  name: newClassName,
                  description: newClassDescription,
                  user_id: user.id,
                  image_url: publicUrl,
                  created_at: new Date().toISOString(),
                })
                .select();
  
              if (insertError) throw insertError;
  
              console.log("Insert berhasil:", data);
  
              // update state
              setHasClass(true);
              setNewClassName("");
              setNewClassDescription("");
              setNewProductImageFile(null);
              setShowAddModal(false);
  
              try {
                await recordAction(user.id, "create_class");
                if (!hasProduct && !hasClass) {
                  await recordAction(user.id, "open_store");
                }
                const newly3 = await evaluateAchievements(user.id);
                if (newly3.length) {
                  setAchievements((prev) => [...prev, ...newly3]);
                  setUnlockQueue((prev) => [...prev, ...newly3]);
                }
              } catch {}
            } catch (err) {
              console.error("Gagal menambahkan kelas:", err);
              alert("Gagal menambahkan kelas, cek console log!");
            } finally {
              setSavingNew(false);
            }
          }}
          className="flex-1 bg-[var(--black)] text-white rounded-full py-2 hover:bg-[var(--dark-grey)]"
        >
          {savingNew ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  )
}