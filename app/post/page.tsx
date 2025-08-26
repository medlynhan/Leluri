'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Button from '../components/Button';

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
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handlePost = async () => {
        if (!description || !category || !image || !user) {
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
            router.push('/Profile');
        }

        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Write something about your post..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category
                    </label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., Art, Craft, etc."
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image
                    </label>
                    <input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                    {imageUrl && (
                        <div className="mt-4">
                            <Image src={imageUrl} alt="Preview" width={200} height={200} className="rounded-lg" />
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

                <div className="flex items-center justify-between">
                    <Button
                        onClick={handlePost}
                        text={loading ? 'Posting...' : 'Post'}
                        additional_styles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostPage;
