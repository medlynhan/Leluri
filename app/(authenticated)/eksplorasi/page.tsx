'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryFiltering } from '@/components/CategoryFilter';
import { Category, Post } from '@/lib/types';
import { useGetPosts } from '@/lib/client-queries/posts';
import { DetailedPostWithMedia } from '@/lib/types/posts';
import { FaX } from 'react-icons/fa6';
import Image from 'next/image'
import PostCard from '@/components/PostCard';
import DetailedPostModal from '@/components/modal/DetailedPostModal';
import { MinimalInfoUser } from '@/lib/types/users';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useGetPostCategories } from '@/lib/client-queries/postcategories';
import LoadingComponent from '@/components/LoadingComponent';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import FollowButton from '@/components/FollowButton';
import Sidebar from "../../components/Sidebar";
import { FaSearch } from 'react-icons/fa';


const EksplorasiPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<MinimalInfoUser[]>([]);
  const [postModalId, setPostModalId] = useState<string | null>(null);
  const [categoryFilterOpened, setCategoryFilterOpened] = useState(false);
  const [selectedPostCategories, setSelectedPostCategories] = useState<string[]>([]);

  const { data: posts = [], isLoading: isGetPostsLoading } = useGetPosts(user?.id);
  const { data: postcategories, isLoading: isGetPostCategoriesLoading } = useGetPostCategories();

  // Filtered posts sesuai search & category
  const filteredPosts: DetailedPostWithMedia[] = useMemo(() => {
    let filtered = posts;

    // Category filter
    if (selectedPostCategories.length > 0) {
      filtered = filtered.filter(post => selectedPostCategories.includes(post.category_id));
    }

    // Search filter (username)
    if (search.trim().length > 0) {
      filtered = filtered.filter(post => post.user.username.toLowerCase().includes(search.toLowerCase()));
    }

    return filtered;
  }, [posts, selectedPostCategories, search]);

  // User search results
  useEffect(() => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    const uniqueUsers = posts
      .filter(post => post.user.username.toLowerCase().includes(search.toLowerCase()) && post.user.id !== user?.id)
      .map(post => post.user)
      .filter((value, index, self) => index === self.findIndex(t => t.id === value.id));

    setUsers(uniqueUsers);
  }, [search, posts, user?.id]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
      else router.push('/login');
    };
    fetchUser();
  }, [router]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = postModalId ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [postModalId]);

  if (isGetPostCategoriesLoading) return <LoadingComponent message='Loading post categories options...' />
  if (isGetPostsLoading) return <LoadingComponent message='Loading all posts...' />

  return (
    <div className="relative w-full h-full overflow-x-hidden">

      {/* Navbar */}
      <div className="absolute top-0 left-0 flex gap-4 justify-center items-center h-14 bg-[var(--white)] w-full z-50 fixed p-2 max-w-screen">
        <Sidebar />

        {/* Search bar */}
        <div className="flex flex-1 justify-center items-center ml-10 lg:ml-64 relative h-full">
          <input
            type="text"
            placeholder="Apa yang ingin kamu temukan?"
            className="w-full pl-12 pr-4 border border-gray-200 shadow-xs rounded-full h-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && null}
          />
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--dark-grey)]" />
          {search.length > 0 && (
            <FaX
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 hover:bg-gray-100 p-1 rounded-full cursor-pointer"
              onClick={() => setSearch('')}
            />
          )}
        </div>

        {/* Filter */}
        <div className="hidden md:flex">
          <CategoryFiltering
            categories={postcategories ?? []}
            selectedCategories={selectedPostCategories}
            setSelectedCategories={setSelectedPostCategories}
            open={categoryFilterOpened}
            setOpen={setCategoryFilterOpened}
          />
        </div>

        {/* Buttons */}
        <button
          onClick={() => null}
          className="h-full px-6 bg-[var(--yellow)] text-white rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent hover:text-[var(--black)] transition-colors"
        >
          Cari
        </button>
        <Button
          className="hidden md:flex h-full px-6 bg-[var(--yellow)] text-white rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent hover:text-[var(--black)] transition-colors"
          onClick={() => router.push("/post")}
        >
          <FaPlus className="mr-2" /> Buat Post
        </Button>
      </div>

      {/* User search results */}
      {search.trim() && users.length > 0 && (
        <div className="ml-3 mr-3  p-3 lg:ml-68 mt-20 w-full max-w-[calc(100%-1rem)] lg:max-w-[calc(100%-18rem)]">
          <span className="font-semibold text-lg">Person ({users.length})</span>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10em,1fr))] gap-3 lg:gap-6 mt-4">
            {users.map(u => (
              <div
                key={u.id}
                className="flex flex-col items-center justify-center p-4 border border-[var(--medium-grey)] rounded-md cursor-pointer"
                onClick={() => router.push(`/profile/${u.id}`)}
              >
                <Avatar className="mb-2 w-18 h-18 border border-gray-500 rounded-full overflow-hidden flex justify-center items-center">
                  <AvatarImage src={u.image_url || "/placeholder.svg"} />
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{u.username}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{u.role}</p>
                {user && <FollowButton userId={user.id} followed={u.followed ?? false} followedUserId={u.id} className="mt-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 && (
        <div className="ml-3 mr-3 lg:ml-68 p-3 flex flex-col max-w-[calc(100%-1rem)] mt-10 w-full lg:max-w-[calc(100%-18rem)]">
          {/* Hanya tampilkan jumlah post kalau tidak search */}
          {!search.trim() ? null : <span className="font-semibold text-lg w-full">Post ({filteredPosts.length})</span>}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(20em,1fr))] gap-3 lg:gap-6 mt-4 w-full">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setPostModalId(post.id)}
                userId={user?.id ?? ""}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty states */}
      {!posts.length && (
        <div className="flex flex-col items-center justify-center w-full h-full mt-20">
          <Image src="/logo/empty.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">Belum Ada Postingan</p>
        </div>
      )}
      {filteredPosts.length === 0 && posts.length > 0 && users.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full mt-20">
          <Image src="/logo/no_result.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">Yah, Kami tidak menemukan pencarian</p>
        </div>
      )}

      {/* Modal */}
      {postModalId && user && (
        <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId} userId={user.id} />
      )}
    </div>
  );
}

export default EksplorasiPage;