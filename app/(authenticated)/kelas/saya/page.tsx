"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import { ArrowLeft, Star, Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: string;
  user_id: string;
  name: string;
  image_url?: string;
  created_at: string;
  rating?: number;
  description?: string;
}

const SelfClassesPage: React.FC = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ClassItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Cek user login
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/Login");
        return;
      }
      setUserId(user.id);
    })();
  }, [router]);

  // Fetch classes
  useEffect(() => {
    if (!userId) return;
    fetchClasses();
  }, [userId]);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch error:", error);
    setClasses((data as ClassItem[]) || []);
    setLoading(false);
  };

  // ⭐ Komponen rating
  const StarRating = ({ rating }: { rating?: number }) => {
    const value = Math.max(
      0,
      Math.min(5, Number.isFinite(rating ?? 0) ? rating ?? 0 : 0)
    );
    return (
      <div className="flex items-center gap-1 text-[10px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = value >= i + 1;
          return (
            <Star
              key={i}
              className={`w-3 h-3 ${
                filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          );
        })}
        <span className="ml-1 text-xs text-gray-600">{value.toFixed(1)}</span>
      </div>
    );
  };

  // 🗑️ Hapus kelas
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kelas ini?")) return;
    await supabase.from("classes").delete().eq("id", id);
    setClasses((c) => c.filter((x) => x.id !== id));
  };

  // 💾 Simpan edit
  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    await supabase
      .from("classes")
      .update({
        name: editing.name,
        description: editing.description,
      })
      .eq("id", editing.id);

    setClasses((list) =>
      list.map((k) =>
        k.id === editing.id
          ? { ...k, name: editing.name, description: editing.description }
          : k
      )
    );
    setEditing(null);
    setSaving(false);
  };

  return (
    <div className="p-6 w-full">
      {/* Tombol kembali */}
      <header className={`top-0 left-0 fixed w-[100vw] z-50 bg-[var(--white)] flex justify-between items-center md:px-6 py-3 `}>
        <button onClick={() => router.back()} className="p-2 hover:bg-[var(--light-grey)] hover:text-[var(--yellow)] rounded-full ml-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>
      <div className="flex items-center mt-10 mb-10 justify-between md:px-6">
        <h1 className="text-lg font-semibold">Kelas ({classes.length})</h1>
      </div>
      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] p-3 gap-3 lg:gap-6 mt-20 ">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="py-20 text-center text-gray-500">Belum ada kelas.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:px-6 ">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white w-full rounded-2xl overflow-hidden border border-gray-200 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Gambar */}
              <div className="relative aspect-square">
                {cls.image_url && (
                  <Image
                    src={cls.image_url}
                    alt={cls.name}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{cls.name}</h3>

                <div className="my-2">
                  <StarRating rating={cls.rating} />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {cls.description || "Tidak ada deskripsi"}
                </p>

                {/* Action buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={() => setEditing(cls)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full hover:bg-gray-50"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 border rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal edit */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-xl p-5 w-80 min-h-[50vh] flex flex-col justify-center m-5">
            <h2 className="font-semibold mb-4 text-sm">Edit Kelas</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nama
                </label>
                <input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 border rounded-full text-xs py-2 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="flex-1 bg-black text-white rounded-full text-xs py-2 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah kelas */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800"
        aria-label="Tambah Kelas"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SelfClassesPage;
