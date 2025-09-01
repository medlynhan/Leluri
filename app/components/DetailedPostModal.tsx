import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Heart, MessageCircle, Pause, Send, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { DetailedPostWithComments } from "@/lib/types/posts"
import { useEffect, useState } from "react"
import { format, formatDistanceToNow } from 'date-fns'
import Image from "next/image"
import { FaArrowLeft, FaCircle } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa"
import CommentCard from "./CommentCard"
import MediaCarousel from "./MediaCarousel"

interface DetailedPostModal {
  postId: string,
  setPostModalId: React.Dispatch<React.SetStateAction<string|null>>,
}

const DetailedPostModal = ({
  postId,
  setPostModalId,
} : DetailedPostModal) => {

  const temp_post: DetailedPostWithComments = {
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
  
  const [post, setPost] = useState<DetailedPostWithComments|null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  useEffect(() => {
    setPost(temp_post)
  }, [])

  const [mediaIdx, setMediaIdx] = useState<number>(0)

  // const handleMediaChange = (value : number) => {
  //   console.log("change")
  //   if(mediaIdx + value < 0 || mediaIdx + value >= (post?.posts_media.length ?? 0)) return
  //   setMediaIdx(mediaIdx + value)
  //   setIsVideoPlaying(false)
  // }

  // const handleVideoClick = () => {
  //   const videoElement = document.getElementById(`video-${mediaIdx}`) as HTMLVideoElement;
  //   if (videoElement) {
  //     if (isVideoPlaying) {
  //       videoElement.pause();
  //     } else {
  //       videoElement.play();
  //     }
  //     setIsVideoPlaying(!isVideoPlaying);
  //   }
  // };

  if(!post) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex z-1">
        <span className="flex-1 flex flex-col overflow-scroll">
          <div className="py-3 px-4 border-b flex items-center gap-3">
            <Avatar className="flex w-10 h-10 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src="/simple-green-leaf-logo.png" />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm line-clamp-1">{post.user.username}</div>
              <div className="text-gray-500 text-xs line-clamp-1">{post.user.role}</div>
            </div>
          </div>

          {/* <div className="flex flex-col w-full h-108">
            <div className="w-full object-contain flex-1 relative bg-gray-100 overflow-auto">
              {post.posts_media && post.posts_media[mediaIdx].media_type === "image" && (
                <Image
                src={post.posts_media[mediaIdx].url}
                alt="Media not accessible..."
                height={480}
                width={480}
                className="object-contain w-full h-full bg-gray-200"/>
              )}
              {post.posts_media && post.posts_media[mediaIdx].media_type === "video" && (
                <div className="relative w-full h-full p-0 m-0" onClick={handleVideoClick}>
                  <video
                    id={`video-${mediaIdx}`}
                    className="object-contain w-full h-full bg-gray-200 cursor-pointer"
                    loop
                  >
                    <source src={post.posts_media[mediaIdx].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!isVideoPlaying && <Pause className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white fill-white" />}
                </div>
              )}
            </div>
            <div className="h-6 w-full flex flex-row gap-2 items-center justify-center border-none z-100">
              <FaArrowLeft style={{ fontSize: '12px' }} className="text-gray-500 hover:bg-gray-100" onClick={() => handleMediaChange(-1)}/>
              {post.posts_media.map((_, idx) => (
                <FaCircle style={{ fontSize: '4px' }} className={idx === mediaIdx ? `text-gray-700` : `text-gray-200`}/>
              ))}
              <FaArrowRight style={{ fontSize: '12px' }} className="text-gray-500 hover:bg-gray-100" onClick={() => handleMediaChange(1)}/>
            </div>
          </div> */}
          <MediaCarousel posts_media={post.posts_media}/>

          <span className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.like_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comment_count}</span>
                </div>
              </div>
            </div>
            <span className="text-sm">
              <span className="font-semibold">{post.title.length > 0 && `${post.title} | `}</span>
              {post.description}
            </span>
            <div className="text-xs text-gray-500 mt-2">Posted on {format(post.created_at, "dd/MM/yyyy HH:mm")}</div>
          </span>
        </span>

        <div className="w-80 border-l flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Comments ({post.comment_count})</h3>
            <Button variant="ghost" size="sm" onClick={() => setPostModalId(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {post.posts_comments.concat(post.posts_comments).concat(post.posts_comments).concat(post.posts_comments).concat(post.posts_comments).concat(post.posts_comments).map((comment) => (
              <CommentCard comment={comment} user={post.user} key={comment.id}/>
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
        </div>
      </div>
    </div>
  )
}

export default DetailedPostModal