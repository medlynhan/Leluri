"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useGetClassById } from "@/lib/client-queries/classes";
import LoadingComponent from "@/components/LoadingComponent";
import RegistrationModal from "@/components/modal/ClassRegistrationModal";
import StarRating from "../../../../components/StarRating";

export default function ClassDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = useState(false);

  // ✅ Cek user login
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
      else router.push("/login");
    })();
  }, [router]);

  if (!id) return <p>No class ID provided.</p>;

  // ✅ Query data kelas
  const {
    data: classData,
    isLoading,
    isError,
  } = useGetClassById(Array.isArray(id) ? id[0] : id);

  // ✅ Loading
  if (isLoading) return <LoadingComponent message="Loading class details..." />;
  if (isError || !classData) return <div className="p-4">Could not load class data.</div>;

  const containerWidth = "min-w-screen";

  return (
    <div className="overflow-x-hidden flex w-screen min-h-screen">
      {/* Header */}
      <header className={`top-0 left-0 fixed w-[100vw] z-50 bg-white flex justify-between items-center md:px-6 py-3 ${containerWidth}`}>
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full ml-4 hover:text-[var(--yellow)]">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 mt-16 p-6 md:px-12 w-full">
        
        {/* Kolom Kiri */}
        <div className="flex w-full md:w-[40%] flex-col gap-5">
          <h1 className="leading-tight break-words text-2xl font-semibold md:hidden">{classData.name}</h1>
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100">
            <Image src={classData.image_url || "/no-image.png"} alt={classData.name} fill className="object-cover" />
          </div>

          {/* Tombol daftar */}
          <button
            className="w-full py-3 rounded-full border border-[var(--black)] text-[var(--black)] font-semibold hover:bg-[var(--light-grey)] transition"
          >
            Hubungi Tutor
          </button>
          <button
            onClick={() => setIsRegistrationModalOpened(true)}
            className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-[var(--dark-grey)] transition"
          >
            Daftar Kelas
          </button>
        </div>

        {/* Kolom Kanan */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          <h1 className="leading-tight break-words text-3xl font-semibold hidden md:flex">{classData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={classData.rating} size={20} />
          </div>

          {/* Deskripsi */}
          <section className="space-y-2 w-full">
            <h2 className="text-base font-semibold">Deskripsi Kelas</h2>
            <p className="leading-relaxed whitespace-pre-line break-words text-justify">{classData.description}</p>
          </section>

          {/* Tutor */}
          <section className="space-y-3 w-full">
            <h2 className="text-base font-semibold">Tutor</h2>
            <div className="flex items-center gap-3">
              <Image
                src={classData.creator?.image_url || "/default-avatar.png"}
                alt={classData.creator?.username || "Tutor"}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{classData.creator?.username}</p>
                <p className="text-gray-500 text-sm capitalize">{classData.creator?.role}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal daftar */}
      {isRegistrationModalOpened && user && (
        <RegistrationModal
          formData={{
            class_id: id ? (Array.isArray(id) ? id[0] : id) : "",
            user_id: user.id,
            notes: "",
          }}
          showRegistrationModal={isRegistrationModalOpened}
          setShowRegistrationModal={setIsRegistrationModalOpened}
          user={user}
          className="fixed top-0 left-0 z-[105] h-screen w-screen overflow-auto"
        />
      )}
    </div>
  );
}
