'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import { useGetPostCategories } from '@/lib/client-queries/postcategories';
import LoadingComponent from '@/components/LoadingComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { useCreatePost } from '@/lib/client-queries/posts';
import { PostFormData } from '@/lib/types/posts';

const PostPage = () => {
  
    const [user, setUser] = useState<User | null>(null);
    const [inputError, setInputError] = useState<string|null>(null);
    const router = useRouter();

    useEffect(() => {
      const fetchUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
              setUser(user);
          } else {
              router.push('/login');
          }
      };
      fetchUser();
    }, [router]);

    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<PostFormData>({
      title: '',
      description: '',
      category_id: '',
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
      console.log(formData)
    }, [formData])

    const handleInputFormData = (
      field: keyof PostFormData,
      value: string
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    const { data: postcategories, isLoading: isGetPostCategoriesLoading, isError : isGetPostCategoriesError, error: getPostCategoriesError } = useGetPostCategories()
    const { mutate: createPost, isPending: isCreatePostPending, isError: isCreatePostError, error: createPostError } = useCreatePost();

    const handlePost = () => {

      if(!formData.category_id || formData.category_id.length <= 0){
        setInputError("Category must be filled!")
        return
      }
      if(!image){
        setInputError("At minumum 1 image must be posted!")
        return
      }
      if(!user){
        setInputError("User is not authenticated, redirecting to login page...")
        return
      }

      createPost({ 
        ...formData, 
        posts_media: [image],
        user_id: user.id
      }, {
        onSuccess: () => router.push('/profile')
      });
    }

    if(isGetPostCategoriesLoading) return <LoadingComponent message="Loading post categories options ..."/>
    if(isGetPostCategoriesError) return <LoadingComponent message=""/>

    return (
    <div className="relative overflow-y-scroll min-h-[screen] flex top-0 left-0 min-w-full min-h-screen  bg-black/70 items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl grid gap-4 min-h-[50%] lg:min-w-[40%] min-w-[80%] p-6 my-15 md:my-25">
        
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

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--black)] mb-2">
              Judul Post (opsional)
            </label>
            <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg text-sm"
            placeholder="Tulis judul post di sini ..."
            value={formData.title}
            onChange={(e) => handleInputFormData("title", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--black)] mb-2">
              Deskripsi Post (opsional)
            </label>
            <textarea
            id="description"
            rows={5}
            className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg text-sm"
            placeholder="Tulis deskripsi fotomu di sini..."
            value={formData.description}
            onChange={(e) => handleInputFormData("description", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[var(--black)] mb-2">
              Post Category
            </label>
            <SelectDropdown 
            options={postcategories ?? []}
            value={formData.category_id}
            onChange={(value) => handleInputFormData("category_id", value)}
            className="w-full"/>
          </div>
        </div>

        {/* Error */}
        {inputError && <p className="text-red-500 text-xs text-center mt-3">{inputError}</p>}

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
            disabled={isCreatePostPending}
            className="flex-1 py-2 px-4 bg-black text-white rounded-full text-sm font-medium border border-transparent cursor-pointer hover:bg-[var(--dark-grey)] transition-colors disabled:bg-gray-400"
          >
            {isCreatePostPending ? 'Membagikan...' : 'Bagikan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
