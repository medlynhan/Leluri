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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-[480px] max-w-lg mx-4 relative">
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">Postingan Baru</h1>
                    <p className="text-gray-500">Buat postingan terbaikmu!</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                        <label
                            htmlFor="file-upload"
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                        >
                            <div className="space-y-1 text-center">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt="Preview" width={200} height={200} className="rounded-lg mx-auto" />
                                ) : (
                                    <>
                                        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                                            <Plus size={32} />
                                        </div>
                                        <p className="text-sm text-gray-600">Unggah Foto</p>
                                    </>
                                )}
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </div>
                        </label>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Deskripsi Foto
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                placeholder="Tulis deskripsi fotomu di sini..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Kategori
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="category"
                                name="category"
                                rows={4}
                                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                placeholder="Tulis category postmu di sini..."
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-xs text-center mt-4">{error}</p>}

                <div className="mt-8">
                    <button
                        onClick={handlePost}
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                    >
                        {loading ? 'Membagikan...' : 'Bagikan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
