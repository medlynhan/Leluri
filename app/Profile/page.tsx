'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import Button from '../components/Button';
import PostPreview from '../components/PostPreview';

interface Post {
    id: string;
    user_id: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    category: string;
}

interface ProfileState {
    username: string;
    role: string;
    biography: string;
    location: string;
    image_url: string;
    followers: string[];
    following: string[];
    achievements: string[];
}

const ProfilePage: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileState | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (error) {
                    setError(error.message);
                } else if (data) {
                    setProfile(data);
                }

                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('user_id', user.id);

                if (postsError) {
                    setError(postsError.message);
                } else if (postsData) {
                    setPosts(postsData);
                }

            } else {
                router.push('/Login');
            }
            setLoading(false);
        };

        fetchUserAndPosts();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user || !profile) return;

        setLoading(true);
        setError(null);

        let imageUrl = profile.image_url;

        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, { upsert: true });

            if (uploadError) {
                setError(uploadError.message);
                setLoading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            imageUrl = publicUrl;
        }

        const { error: dbError } = await supabase
            .from('users')
            .update({
                username: profile.username,
                role: profile.role,
                biography: profile.biography,
                location: profile.location,
                image_url: imageUrl,
            })
            .eq('id', user.id);

        if (dbError) {
            setError(dbError.message);
        } else {
            setProfile({ ...profile, image_url: imageUrl });
            setIsEditMode(false);
        }
        setLoading(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>No profile found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 p-4 border-r">
                    {isEditMode ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <Image
                                    src={avatarFile ? URL.createObjectURL(avatarFile) : profile.image_url || '/default-avatar.png'}
                                    alt="Profile"
                                    width={150}
                                    height={150}
                                    className="rounded-full"
                                />
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md">
                                    <FaPlus />
                                </label>
                                <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="input input-bordered w-full" placeholder="Username" />
                            <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="select select-bordered w-full">
                                <option>Pelajar Budaya</option>
                                <option>Pengrajin</option>
                                <option>Sanggar Seni</option>
                                <option>Kolektor</option>
                            </select>
                            <textarea value={profile.biography} onChange={(e) => setProfile({ ...profile, biography: e.target.value })} className="textarea textarea-bordered w-full" placeholder="Bio"></textarea>
                            <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="input input-bordered w-full" placeholder="Location" />
                            <div className="flex gap-2">
                                <Button onClick={() => setIsEditMode(false)} text="Batal" additional_styles="bg-gray-300 text-black" />
                                <Button onClick={handleUpdateProfile} text="Simpan" additional_styles="bg-black text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center gap-2">
                            <Image
                                src={profile.image_url || '/default-avatar.png'}
                                alt="Profile"
                                width={150}
                                height={150}
                                className="rounded-full"
                            />
                            <p className="text-gray-500">{profile.role}</p>
                            <h1 className="text-2xl font-bold">{profile.username}</h1>
                            <p>{profile.biography}</p>
                            <Button onClick={() => setIsEditMode(true)} text="Edit Profile" additional_styles="w-full" />
                            <div className="flex justify-around w-full mt-4">
                                <div>
                                    <p className="font-bold">{profile.followers.length}</p>
                                    <p>pengikut</p>
                                </div>
                                <div>
                                    <p className="font-bold">{profile.following.length}</p>
                                    <p>mengikuti</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <IoLocationOutline />
                                <p>{profile.location}</p>
                            </div>
                            <hr className="w-full my-4" />
                            <h2 className="font-bold">Pencapaian</h2>
                            <div className="flex gap-2 mt-2">
                                {profile.achievements.map((ach, i) => (
                                    <div key={i} className="bg-yellow-200 p-2 rounded-full">{ach}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 p-4">
                    {posts.length > 0 ? (
                        <div className="relative h-full">
                            <div className="grid grid-cols-3 gap-4">
                                {posts.map(post => (
                                    <div key={post.id} className="cursor-pointer" onClick={() => setSelectedPost(post)}>
                                        <Image src={post.image_url} alt={post.description} width={200} height={200} className="object-cover w-full h-full"/>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => router.push('/post')}
                                className="absolute top-4 right-4 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800"
                                aria-label="Create new post"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <FaPlus className="text-5xl text-gray-400" />
                            <p className="mt-4 text-gray-600">Mulai postingan pertama kamu</p>
                            <Button onClick={() => router.push('/post')} text="Create Post" additional_styles="mt-4 bg-black text-white" />
                        </div>
                    )}
                </div>
            </div>
            {selectedPost && <PostPreview post={selectedPost} onClose={() => setSelectedPost(null)} />}
        </div>
    );
};

export default ProfilePage;
