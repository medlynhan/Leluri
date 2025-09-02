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
import DetailedPostModal from '@/components/DetailedPostModal';
import { MinimalInfoUser } from '@/lib/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useGetPostCategories } from '@/lib/client-queries/postcategories';
import LoadingComponent from '@/components/LoadingComponent';

const EksplorasiPage = () => {

  const { data: posts = [], isLoading: isGetPostsLoading, isError: isGetPostsError, error: getPostsError } = useGetPosts()
  const { data: postcategories, isLoading: isGetPostCategoriesLoading, isError: isGetPostCategoriesError, error: getPostCategoriesError} = useGetPostCategories()

  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  const [filteredPosts, setFilteredPosts] = useState<DetailedPostWithMedia[]>(posts)
  const [categoryFilterOpened, setCategoryFilterOpened] = useState<boolean>(false)
  const [selectedPostCategories, setSelectedPostCategories] = useState<string[]>([]);
  const [postModalId, setPostModalId] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

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
      <div className="sticky top-0 flex flex-row items-center gap-4 p-4 z-1 bg-white">
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
      </div>

      {users.length > 0 &&
      <div className="flex flex-col w-full px-12">
        <span className="font-bold text-lg mb-4">Person ({users.length})</span>
        <div className="grid grid-cols-6 gap-3 overflow-hidden p-1">
          {users.map((user) => (
            <div className="flex flex-col items-center max-w-48 justify-center p-4 shadow-md rounded-md" key={user.id}>
              <Avatar className="mb-2 w-18 h-18 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                <AvatarImage src={user.image_url || "/placeholder.svg"} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{user.username}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{user.role}</p>
            </div>
          ))}
        </div>
      </div>}

      {(!posts || posts.length <= 0) ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/logo/empty.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No posts exist yet ...</p>
        </div>
      ) : (filteredPosts.length <= 0 && users.length <= 0) ? (
        <div className="flex items-center justify-center flex-col w-full h-full">
          <Image src="/logo/no_result.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No search results ...</p>
        </div>
      ) : (
        <div className="flex flex-col w-full px-12 pb-12 pt-4">
          <span className="font-bold text-lg mb-4">Content ({posts.length})</span>
          <div className="grid grid-cols-3 gap-6 overflow-hidden h-0 flex-1 p-1">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => setPostModalId(post.id)}/>
            ))}
          </div>
        </div>
      )}

      {(postModalId !== null) &&
      <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId}/>}
    </div>
  );
};

export default EksplorasiPage;
