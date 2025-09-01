'use client'
import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { DetailedPostWithComments } from '@/lib/types/posts';
import { Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CommentCard from '@/components/CommentCard';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';

const BerandaPage = () => {
  return (
    <div className={`top-0 left-0 w-full relative min-h-screen bg-white overflow-x-hidden flex`}>
        {/*Sidebar */}
        <Sidebar />
    
        {/*Content */}
        <div className='w-full min-h-screen ml-0 lg:ml-64 flex justify-center items-center'>
          <p>Here is Home Content</p>
        </div>
    </div>
      
  );
};

export default BerandaPage;
