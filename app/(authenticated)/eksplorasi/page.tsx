'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryFiltering } from '@/components/CategoryFilter';
import { Category, Post } from '@/lib/types';
import { useGetPosts } from '@/lib/client-queries/posts';
import { DetailedPost } from '@/lib/types/posts';
import { FaX } from 'react-icons/fa6';
import Image from 'next/image'
import PostCard from '@/components/PostCard';
import DetailedPostModal from '@/components/DetailedPostModal';
import { MinimalInfoUser } from '@/lib/types/user';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const EksplorasiPage = () => {

  const temp_categories = [
    { id: "a1b2c3d4", name: "Kerajinan Tangan" },
    { id: "e5f6g7h8", name: "Seni Rupa" },
    { id: "i9j0k1l2", name: "Pakaian Tradisional" },
    { id: "m3n4o5p6", name: "Seni Pertunjukan" },
    { id: "q7r8s9t0", name: "Kuliner Tradisional" }
  ];
  const temp_posts: DetailedPost[] = [
    {
      id: "1",
      user_id: "anyaman_indonesia",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "5 Tips Buat Anyaman utk pemula",
      created_at: "2025-08-30T14:00:00Z",
      category_id: "e5f6g7h8",
      like_count: 19,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756485694500.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756376166448.png',
          is_main: true
        },
      ]
    },
    {
      id: "3",
      user_id: "anyaman_indonesia",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "Traditional Batik Crafting Techniques",
      created_at: "2025-08-28T09:15:00Z",
      category_id: "e5f6g7h8",
      like_count: 19,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'video',
          created_at: new Date().toISOString(),
          url: '/posts/video 1.mp4',
          is_main: true
        }
      ]
    },
    {
      id: "2",
      user_id: "anyaman_indonesia",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "Wayang Puppet Performance - Traditional Indonesian Art",
      created_at: "2025-08-29T10:30:00Z",
      category_id: "performance",
      like_count: 19,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'video',
          created_at: new Date().toISOString(),
          url: '/posts/video 1.mp4',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756376166448.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756485694500.png',
          is_main: true
        }
      ]
    },
    {
      id: "4",
      user_id: "anyaman_indonesia",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "Balinese Traditional Dance Performance",
      created_at: "2025-08-27T13:45:00Z",
      category_id: "performance",
      like_count: 19,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756376166448.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756485694500.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'video',
          created_at: new Date().toISOString(),
          url: '/posts/video 1.mp4',
          is_main: true
        }
      ]
    },
    {
      id: "5",
      user_id: "anyaman_indonesia",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "Cultural Education in Traditional Indonesian Crafts",
      created_at: "2025-08-26T11:00:00Z",
      category_id: "education",
      like_count: 19,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756376166448.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756485694500.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'video',
          created_at: new Date().toISOString(),
          url: '/posts/video 1.mp4',
          is_main: true
        }
      ]
    },
    {
      id: "6",
      user_id: "juliana_batik",
      user: {
        id: "anyaman_indonesia",
        username: "anyaman_indonesia",
        image_url: '/posts/1756376166448.png',
        role: 'pengrajin'
      },
      title: "5 Tips Buat Anyaman utk pemula",
      description: "7 Langkah Pembuatan Batik - A Detailed Guide",
      created_at: "2025-08-25T16:00:00Z",
      category_id: "Seni Rupa",
      like_count: 0,
      comment_count: 3,
      posts_media: [
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756376166448.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'image',
          created_at: new Date().toISOString(),
          url: '/posts/1756485694500.png',
          is_main: true
        },
        {
          id: '112233',
          post_id: 'xxyyzz',
          media_type: 'video',
          created_at: new Date().toISOString(),
          url: '/posts/video 1.mp4',
          is_main: true
        }
      ]
    }
  ];

  const [posts, setPosts] = useState<DetailedPost[]>([])
  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  const [filteredPosts, setFilteredPosts] = useState<DetailedPost[]>([])

  const [categoryFilterOpened, setCategoryFilterOpened] = useState<boolean>(false)
  const [postcategories, setPostCategories] = useState<Category[]>([])
  const [selectedPostCategories, setSelectedPostCategories] = useState<string[]>([]);

  const [postModalId, setPostModalId] = useState<string | null>(null)

  // const { data: posts, isLoading, isError, error } = useGetPosts()
  useMemo(() => {
    setPosts(temp_posts)
    setPostCategories(temp_categories)
  }, [])

  useMemo(() => {
    if (selectedPostCategories.length > 0) {
      const filtered = posts.filter((post) =>
        selectedPostCategories.includes(post.category_id)
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedPostCategories, posts]);

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

  const [search, setSearch] = useState<string>('')
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

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 flex flex-row items-center gap-4 p-4 z-1 bg-white">
        <div className="relative w-full">
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
        categories={postcategories}
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
