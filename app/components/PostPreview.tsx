'use client'
import React from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

interface Post {
    id: string;
    user_id: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    category: string;
}

interface PostPreviewProps {
    post: Post;
    onClose: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full h-96">
                    <Image src={post.image_url} alt={post.description} layout="fill" objectFit="contain" />
                </div>
                <div className="p-4">
                    <p className="font-bold">{post.category}</p>
                    <p>{post.description}</p>
                    <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{post.likes} likes</p>
                </div>
            </div>
        </div>
    );
};

export default PostPreview;
