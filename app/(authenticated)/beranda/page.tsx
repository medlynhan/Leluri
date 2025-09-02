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

  // const temp_posts: DetailedPostWithComments[] = [
  //   {
  //     id: "1",
  //     user_id: "anyaman_indonesia",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "5 Tips Buat Anyaman utk pemula",
  //     created_at: "2025-08-30T14:00:00Z",
  //     category_id: "e5f6g7h8",
  //     like_count: 19,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       },
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "kuru-kuru",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: "2",
  //     user_id: "anyaman_indonesia",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "Wayang Puppet Performance - Traditional Indonesian Art",
  //     created_at: "2025-08-29T10:30:00Z",
  //     category_id: "performance",
  //     like_count: 19,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: "3",
  //     user_id: "anyaman_indonesia",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "Traditional Batik Crafting Techniques",
  //     created_at: "2025-08-28T09:15:00Z",
  //     category_id: "e5f6g7h8",
  //     like_count: 19,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       }
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: "4",
  //     user_id: "anyaman_indonesia",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "Balinese Traditional Dance Performance",
  //     created_at: "2025-08-27T13:45:00Z",
  //     category_id: "performance",
  //     like_count: 19,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       }
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: "5",
  //     user_id: "anyaman_indonesia",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "Cultural Education in Traditional Indonesian Crafts",
  //     created_at: "2025-08-26T11:00:00Z",
  //     category_id: "education",
  //     like_count: 19,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       }
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: "6",
  //     user_id: "juliana_batik",
  //     user: {
  //       id: "anyaman_indonesia",
  //       username: "anyaman_indonesia",
  //       image_url: '/posts/1756376166448.png',
  //       role: 'pengrajin'
  //     },
  //     title: "5 Tips Buat Anyaman utk pemula",
  //     description: "7 Langkah Pembuatan Batik - A Detailed Guide",
  //     created_at: "2025-08-25T16:00:00Z",
  //     category_id: "Seni Rupa",
  //     like_count: 0,
  //     comment_count: 3,
  //     posts_media: [
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756376166448.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'image',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/1756485694500.png',
  //         is_main: true
  //       },
  //       {
  //         id: '112233',
  //         post_id: 'xxyyzz',
  //         media_type: 'video',
  //         created_at: new Date().toISOString(),
  //         media_url: '/posts/video 1.mp4',
  //         is_main: true
  //       }
  //     ],
  //     posts_comments: [
  //       {
  //         id: "aabbcc",
  //         post_id: "xxxxxx",
  //         user_id: "111111",
  //         user: {
  //           id: "anyaman_indonesia",
  //           username: "anyaman_indonesia",
  //           image_url: '/posts/1756376166448.png',
  //           role: 'pengrajin'
  //         },
  //         comment: "Bagus banget!!!",
  //         created_at: new Date().toISOString(),
  //         replies: [
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           },
  //           {
  //             id: "xxxxxx",
  //             comment_id: "xxxxxx",
  //             user_id: "111111",
  //             user: {
  //               id: "anyaman_indonesia",
  //               username: "anyaman_indonesia",
  //               image_url: '/posts/1756376166448.png',
  //               role: 'pengrajin'
  //             },
  //             reply: "Bagus banget!!!",
  //             created_at: new Date().toISOString(),
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  // const [posts, setPosts] = useState<DetailedPostWithComments[]>([])
  // useEffect(() => {
  //   setPosts(temp_posts)
  // }, [])

  const router = useRouter();
  const { data: posts = [], isLoading, isError, error } = useGetPosts()

  const [user, setUser] = useState<User | null>(null);
  const [chosenPostId, setChosenPostId] = useState<string|null>(null)
  
  useEffect(() => {
    console.log(chosenPostId)
  }, [chosenPostId])

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
        {posts.map((post) => (
          <PostCard post={post} key={post.id} onClick={() => setChosenPostId(post.id)}/>
        ))}
      </div>
      {chosenPostId !== null && user &&
      <SideCommentSection 
      post_id={chosenPostId} 
      closeCommentSection={() => setChosenPostId(null)}
      user_id={user.id}/>}
    </div>
  );
};

export default BerandaPage;
