import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Heart, MessageCircle, Send, X } from "lucide-react"
import { DetailedPostWithComments } from "@/lib/types/posts"
import { useEffect, useState } from "react"
import { format } from 'date-fns'
import MediaCarousel from "../MediaCarousel"
import SideCommentSection from "../SideCommentSection"
import { useGetPostById } from "@/lib/client-queries/posts"
import LoadingComponent from "../LoadingComponent"

interface DetailedPostModal {
  postId: string,
  setPostModalId: React.Dispatch<React.SetStateAction<string|null>>,
  userId: string
}

const DetailedPostModal = ({
  postId,
  setPostModalId,
  userId
} : DetailedPostModal) => {

  const { data: post, isLoading, isError, error } = useGetPostById(postId)

  if(isLoading) return <LoadingComponent message="Loading post details..."/>

  return (
    <div className="fixed h-screen inset-0 bg-black/50 flex items-center justify-center z-101 p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] h-full overflow-hidden flex z-1">
        <span className="flex-1 flex flex-col overflow-scroll w-3/4">
          <div className="py-3 px-4 border-b flex items-center gap-3">
            <Avatar className="flex w-10 h-10 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src="/simple-green-leaf-logo.png" />
              <AvatarFallback>{post?.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm line-clamp-1">{post?.user.username}</div>
              <div className="text-gray-500 text-xs line-clamp-1">{post?.user.role}</div>
            </div>
          </div>
          
          <MediaCarousel posts_media={post?.posts_media ?? []}/>

          <span className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post?.like_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post?.comment_count}</span>
                </div>
              </div>
            </div>
            <span className="text-sm text-left">
              <span className="font-semibold text-left">{post && post.title && post?.title.length > 0 && `${post?.title} | `}</span>
              {post?.description}
            </span>
            <div className="text-xs text-gray-500 mt-2">Posted on {post && format(post?.created_at, "dd/MM/yyyy HH:mm")}</div>
          </span>
        </span>

        <SideCommentSection 
        post_id={postId} 
        closeCommentSection={() => setPostModalId(null)}
        user_id={userId}
        className="flex flex-col h-full border-l"/>
      </div>
    </div>
  )
}

export default DetailedPostModal