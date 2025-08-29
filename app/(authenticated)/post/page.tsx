'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';

const PostPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            } else {
                router.push('/Login');
            }
        };
        fetchUser();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handlePost = async () => {
        if (!category || !description || !image || !user) {
            setError('Please fill all fields and select an image.');
            return;
        }

        setLoading(true);
        setError(null);

        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, image);

        if (uploadError) {
            setError(uploadError.message);
            setLoading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filePath);

        const { error: dbError } = await supabase
            .from('posts')
            .insert([{
                user_id: user.id,
                description,
                category,
                image_url: publicUrl,
                likes: 0,
            }]);

        if (dbError) {
            setError(dbError.message);
        } else {
            router.push('/profile');
        }

        setLoading(false);
    };

    return (
    <div className="absolute flex top-0 left-0 min-w-full min-h-full bg-black/70 items-center justify-center z-50">
      <div className="bg-white rounded-2xl grid gap-4 min-h-[50%] lg:min-w-[40%] min-w-[80%] p-6 my-10">
        
        {/* Tombol Close */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--medium-grey)] transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5 text-[var(--dark-grey)]" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-[var(--black)]">Postingan Baru</h1>
          <p className="text-sm text-[var(--dark-grey)]">Bagikan momen terbaikmu 🌸</p>
        </div>

        <div className="space-y-4">
          {/* Upload Foto */}
          <div>
            <label className="block text-sm font-medium text-[var(--black)] mb-2">Foto</label>
            <label
              htmlFor="file-upload"
              className="flex flex-col justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-[var(--medium-grey)] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg mx-auto object-cover"
                />
              ) : (
                <>
                  <div className="mx-auto h-12 w-12 text-[var(--dark-grey)] flex items-center justify-center">
                    <Plus size={28} />
                  </div>
                  <p className="text-xs text-[var(--dark-grey)]">Unggah Foto</p>
                </>
              )}
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--black)] mb-2">
              Deskripsi Foto
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg text-sm"
              placeholder="Tulis deskripsi fotomu di sini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--black)] mb-2">
              Kategori
            </label>
            <input
              id="category"
              type="text"
              className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg text-sm"
              placeholder="Misal: Seni, Kerajinan, Festival"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}

        {/* Tombol Aksi */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2 px-4 border border-[var(--black)] rounded-full text-sm font-medium text-[var(--black)] cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handlePost}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-black text-white rounded-full text-sm font-medium border border-transparent cursor-pointer hover:bg-[var(--dark-grey)] transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Membagikan...' : 'Bagikan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
