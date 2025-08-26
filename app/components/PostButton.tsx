'use client'
import React from 'react';
import { FaPlus } from 'react-icons/fa6';

interface PostButtonProps {
    onClick: () => void;
    className?: string;
}

const PostButton: React.FC<PostButtonProps> = ({ onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 ${className}`}
            aria-label="Create new post"
        >
            <FaPlus />
        </button>
    );
};

export default PostButton;
