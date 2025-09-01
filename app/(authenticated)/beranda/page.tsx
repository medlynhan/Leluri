'use client'
import { Button } from '@/components/ui/button';
import PostCard from '@/components/PostCard';
import { DetailedPostWithComments } from '@/lib/types/posts';
import { Send, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CommentCard from '@/components/CommentCard';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from '@/components/ui/input';

const BerandaPage = () => {

  const temp_posts: DetailedPostWithComments[] = [
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
        },
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
        },
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "kuru-kuru",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
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
        },
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
        }
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
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
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
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
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
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
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
      ],
      posts_comments: [
        {
          id: "aabbcc",
          post_id: "xxxxxx",
          user_id: "111111",
          user: {
            id: "anyaman_indonesia",
            username: "anyaman_indonesia",
            image_url: '/posts/1756376166448.png',
            role: 'pengrajin'
          },
          comment: "Bagus banget!!!",
          created_at: new Date().toISOString(),
          replies: [
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            },
            {
              id: "xxxxxx",
              comment_id: "xxxxxx",
              user_id: "111111",
              user: {
                id: "anyaman_indonesia",
                username: "anyaman_indonesia",
                image_url: '/posts/1756376166448.png',
                role: 'pengrajin'
              },
              reply: "Bagus banget!!!",
              created_at: new Date().toISOString(),
            }
          ]
        }
      ]
    }
  ];

  const [posts, setPosts] = useState<DetailedPostWithComments[]>([])
  useEffect(() => {
    setPosts(temp_posts)
  }, [])

  const [chosenPostId, setChosenPostId] = useState<number|null>(null)
  useEffect(() => {
    console.log(chosenPostId)
  }, [chosenPostId])

  if(!posts || posts.length <= 0) return <div>Loading...</div>

  return (
    <div className="flex flex-row w-full h-full justify-center">
      <div className="flex flex-col w-full px-24 py-12 gap-8 max-w-192">
        {posts.map((post, idx) => (
          <PostCard post={post} key={post.id} onClick={() => setChosenPostId(idx)}/>
        ))}
      </div>
      {(chosenPostId !== null) &&
      <div className="sticky top-0 right-0 flex flex-col h-screen min-w-84 w-full max-w-128 border-l bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Comments ({posts[chosenPostId].comment_count})</h3>
          <Button variant="ghost" size="sm" onClick={() => setChosenPostId(null)}>
            <X className="w-5 h-5"/>
          </Button>
        </div>

        <div className="top-0 flex-1 overflow-y-auto">
          {posts[chosenPostId].posts_comments.map((comment) => (
            <CommentCard comment={comment} user={posts[chosenPostId].user} key={comment.id}/>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input placeholder="Add comments..." className="flex-1 text-sm" />
              <Button size="sm" className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>}
    </div>
      
  );
};

export default BerandaPage;
