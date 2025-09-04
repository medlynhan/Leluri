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
    <div className=" flex flex-row w-full h-full justify-between lg:ml-64 lg:w-[calc(100%-16rem)] fixed h-screen">
      
      <div className="flex flex-col p-10 gap-8 flex-1 w-full h-full overflow-y-auto scrollbar-hide cursor-pointer items-center">
        <div className='w-fit h-fit flex gap-6 flex-col max-w-full md:max-w-[35vw] cursor-pointer '>
        {user && posts.map((post) => (
          <PostCard post={post} key={post.id} userId={user.id}
          onCommentClick={() => setChosenPostId(post.id)}/>
        ))}
        </div>
      </div>

      <div className='md:flex hidden w-fit h-fit'>
        {chosenPostId !== null && user &&
        <SideCommentSection 
        post_id={chosenPostId} 
        closeCommentSection={() => setChosenPostId(null)}
        user_id={user.id}
        className={`${chosenPostId ? "flex" : "hidden"} top-0 right-0 bottom-0 w-80 flex-col h-screen w-full border-l bg-white`}/>}
      </div>
    
    </div>
  );
};

export default BerandaPage;
