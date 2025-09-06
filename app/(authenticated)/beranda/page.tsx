'use client'

import PostCard from '@/components/PostCard';
import React, { useEffect, useState } from 'react';
import { useGetFollowedPosts } from '@/lib/client-queries/posts'; // <-- ganti hook
import SideCommentSection from '@/components/SideCommentSection';
import LoadingComponent from '@/components/LoadingComponent';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DetailedPostModal from '@/components/modal/DetailedPostModal';
import Image from 'next/image'

const BerandaPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [postModalId, setPostModalId] = useState<string | null>(null); // untuk mobile modal
  const [chosenPostId, setChosenPostId] = useState<string | null>(null); // untuk desktop side comment

  const { data: posts = [], isLoading } = useGetFollowedPosts(user?.id); // <-- disini

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

  if (isLoading) return <LoadingComponent message="Fetching most recent posts ..." />;

  return (
    <div className="flex flex-row w-full h-full justify-between lg:ml-64 lg:w-[calc(100%-16rem)] fixed h-screen">
      {/* List posts */}
      <div className="flex flex-col p-10 gap-8 flex-1 w-full h-full overflow-y-auto scrollbar-hide items-center">
        <div className="w-fit h-fit flex gap-6 flex-col max-w-full md:max-w-[35vw]">
          {user && posts.map((post) => (
            <PostCard 
              key={post.id}
              post={post}
              userId={user.id}
              onCommentClick={() => setChosenPostId(post.id)}
              showFollowButton={false}
            />
          ))}
          {posts.length <=0  &&  (
            <div className="w-full max-h-screen flex-col justify-center items-center border-3-">
              <Image src="/empty.png" width={300} height={300} alt="Belum ada postingan" className='opacity-70'/>
              <p className="text-center text-[var(--dark-grey)] text-lg ">Belum ada postingan</p>
              <p className="text-center text-[var(--dark-grey)] ">Yuk segera explore komunitas disini !</p>
            </div>
          )}


        </div>
      </div>

      {/* Side comment hanya tampil di desktop */}
      <div className="md:flex hidden w-fit h-fit">
        {chosenPostId !== null && user && (
          <SideCommentSection
            post_id={chosenPostId}
            closeCommentSection={() => setChosenPostId(null)}
            user_id={user.id}
            className={`${chosenPostId ? "flex" : "hidden"} top-0 right-0 bottom-0 w-80 flex-col h-screen w-full border-l bg-white`}
          />
        )}
      </div>

      {/* Modal detail post hanya tampil di mobile */}
      {postModalId !== null && user && (
        <div className="md:hidden">
          <DetailedPostModal
            postId={postModalId}
            setPostModalId={setPostModalId}
            userId={user.id}
          />
        </div>
      )}
    </div>
  );
};

export default BerandaPage;
