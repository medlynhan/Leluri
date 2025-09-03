'use client'

import PostCard from '@/components/PostCard';
import React, { useEffect, useState } from 'react';
import { useGetPosts } from '@/lib/client-queries/posts';
import SideCommentSection from '@/components/SideCommentSection';
import LoadingComponent from '@/components/LoadingComponent';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const BerandaPage = () => {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  
  const [chosenPostId, setChosenPostId] = useState<string|null>(null)
  const { data: posts = [], isLoading, isError, error } = useGetPosts(user?.id)

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

  if(isLoading) return <LoadingComponent message="Fetching most recent posts ..."/>

  return (
    <div className="flex flex-row w-full h-full justify-center">
      <div className="flex flex-col w-full px-24 py-12 mx-auto gap-8 max-w-192">
        {user && posts.map((post) => (
          <PostCard post={post} key={post.id} userId={user.id}
          onCommentClick={() => setChosenPostId(post.id)}/>
        ))}
      </div>
      {chosenPostId !== null && user &&
      <SideCommentSection 
      post_id={chosenPostId} 
      closeCommentSection={() => setChosenPostId(null)}
      user_id={user.id}
      className="sticky top-0 right-0 flex flex-col h-screen min-w-54 w-full max-w-128 border-l bg-white"/>}
    </div>
  );
};

export default BerandaPage;
