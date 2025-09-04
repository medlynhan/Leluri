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

const EksplorasiPage = () => {

  const router = useRouter()
  const [user, setUser] = useState<User|null>(null)

  const { data: posts = [], isLoading: isGetPostsLoading, isError: isGetPostsError, error: getPostsError } = useGetPosts(user?.id)
  const { data: postcategories, isLoading: isGetPostCategoriesLoading, isError: isGetPostCategoriesError, error: getPostCategoriesError} = useGetPostCategories()

  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  const [filteredPosts, setFilteredPosts] = useState<DetailedPostWithMedia[]>(posts)
  const [categoryFilterOpened, setCategoryFilterOpened] = useState<boolean>(false)
  const [selectedPostCategories, setSelectedPostCategories] = useState<string[]>([]);
  const [postModalId, setPostModalId] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

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

  useEffect(() => {
    if(posts && posts.length > 0) setFilteredPosts(posts)
  }, [posts])

  useMemo(() => {
    if (selectedPostCategories.length > 0) {
      const filtered = posts.filter((post) =>
        selectedPostCategories.includes(post.category_id)
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedPostCategories]);

  useEffect(() => {
    if (postModalId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [postModalId]);

  const searchUser = (search : string) => {
    if(search === '') return
    setFilteredPosts(
      posts.filter((post) => post.user.username.toLowerCase().includes(search.toLowerCase()))
    )
    setUsers(
      posts
      .filter((post) => post.user.username
      .includes(search))
      .map((post) => post.user)
      .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id))
    )
  }

  const handleSearchChange = (input : string) => {
    setSearch(input)
    if(!input || input.length <= 0){
      setFilteredPosts(posts)
      setUsers([])
    }
  }

  if(isGetPostCategoriesLoading) return <LoadingComponent message='Loading post categories options...'/>
  if(isGetPostsLoading) return <LoadingComponent message='Loading all posts...'/>

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 flex flex-row items-center gap-4 p-6 z-1 bg-white">
        <div className="relative w-full ml-20">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Apa yang ingin kamu temukan ?"
            className="pl-12 py-3 text-base border-gray-300 bg-white"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search.length > 0 && (
            <FaX 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:bg-gray-100 p-1 rounded-full"
            onClick={() => handleSearchChange('')}/>
          )}
        </div>
        <CategoryFiltering 
        categories={postcategories ?? []}
        selectedCategories={selectedPostCategories}
        setSelectedCategories={setSelectedPostCategories}
        open={categoryFilterOpened}
        setOpen={setCategoryFilterOpened}/>
        <Button
        className="px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium"
        onClick={() => searchUser(search)}>
          Cari
        </Button>
        <Button
          className="ml-auto px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium shadow-md"
          onClick={() => router.push("/post")}>
            <FaPlus width={5} height={5}/> Create Post
        </Button>
      </div>

      {users.length > 0 &&
      <div className="flex flex-col w-full px-12">
        <span className="font-bold text-lg mb-4">Person ({users.length})</span>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 overflow-hidden p-1">
          {users.map((userSearched) => (
            <div className="flex flex-col items-center max-w-48 justify-center p-4 shadow-md rounded-md" key={userSearched.id}>
              <Avatar className="mb-2 w-18 h-18 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                <AvatarImage src={userSearched.image_url || "/placeholder.svg"} />
                <AvatarFallback>{userSearched.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{userSearched.username}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{userSearched.role}</p>
              {user &&
              <FollowButton
              userId={user.id}
              followed={userSearched.followed ?? false}
              followedUserId={userSearched.id}
              className="mt-2"/>}
            </div>
          ))}
        </div>
      </div>}

      {(!posts || posts.length <= 0) ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/empty.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No posts exist yet ...</p>
        </div>
      ) : (filteredPosts.length <= 0 && users.length <= 0) ? (
        <div className="flex items-center justify-center flex-col w-full h-full">
          <Image src="/no_result.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No search results ...</p>
        </div>
      ) : (
        <div className="flex flex-col w-full px-12 pb-12 pt-4">
          <span className="font-bold text-lg mb-4">Content ({posts.length})</span>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden h-0 flex-1 p-1">
            {user && filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => setPostModalId(post.id)} userId={user.id}/>
            ))}
          </div>
        </div>
      )}

      {(postModalId !== null) && user &&
      <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId} userId={user.id}/>}
    </div>
  );
};

export default EksplorasiPage;
