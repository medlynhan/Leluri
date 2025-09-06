import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Heart, MessageCircle, Send, X } from "lucide-react"
import { DetailedPostWithComments } from "@/lib/types/posts"
import { useEffect, useState } from "react"
import { format } from 'date-fns'
import MediaCarousel from "../MediaCarousel"
import SideCommentSection from "../SideCommentSection"
import { useGetPostById } from "@/lib/client-queries/posts"
import LoadingComponent from "../LoadingComponent"
import { useCreatePostLike, useDeletePostLike } from "@/lib/client-queries/postlikes"

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

const { data: post, isLoading, isError, error } = useGetPostById(postId, userId)


const { mutateAsync: likePost, isPending: isLikePostPending } = useCreatePostLike()
const { mutate: unlikePost, isPending: isUnlikePostPending } = useDeletePostLike()

const handleLike = async () => {
  if (!post) return
  if (post.liked) {
    unlikePost({ user_id: userId, post_id: post.id })
  } else {
    await likePost({ user_id: userId, post_id: post.id })
  }
}


const [showBigHeart, setShowBigHeart] = useState<boolean>(false)

const handleDoubleClick = async () => {
  await handleLike()
  setShowBigHeart(true)
  setTimeout(() => setShowBigHeart(false), 800) // animasi ilang
}


  if (isLoading) {
    return <LoadingComponent message="Loading post details..." />
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error: {String(error)}</div>
  }




  return (
    <div className="fixed h-screen inset-0 bg-black/50 flex items-center justify-center z-101 p-4 ">

      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] scrollbar-hide lg:overflow-hidden overflow-auto  flex lg:flex-row flex-col z-1 md:m-10">
        
        <span className="flex-1 flex flex-col lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide">
          <div className="py-3 px-4 border-b flex items-center gap-3 justify-between">
            <Avatar className="flex w-10 h-10 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src={post?.user?.image_url || "/placeholder.svg"} />
              <AvatarFallback>{post?.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className=" flex-1">
              <div className="font-semibold text-sm line-clamp-1">{post?.user.username}</div>
              <div className="text-gray-500 text-xs line-clamp-1">{post?.user.role}</div>
            </div>
            <button
              onClick={() => setPostModalId(null)}
              className={` p-1 h-full rounded-full hover:bg-[var(--light-grey)] transition-colors flex lg:hidden`}
              aria-label="Tutup"
            >
              <X className="w-5 h-5 text-[var(--black)] " />
            </button>
          </div>
          
          <div onDoubleClick={handleDoubleClick} className="relative">
            <MediaCarousel posts_media={post?.posts_media ?? []}/>
              {showBigHeart && (
                <Heart className="absolute inset-0 m-auto w-24 h-24 text-red-500 opacity-80 animate-ping" />
              )}
          </div>

          <span className=" p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    disabled={isLikePostPending || isUnlikePostPending}
                    onClick={handleLike}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      className={`w-5 h-5 cursor-pointer ${
                        post?.liked ? "text-red-500 fill-current" : "text-[var(--black)] "
                      }`}
                    />
                    <span className="text-sm font-medium">{post?.likes}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post?.comment_count}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-left">
              <p className="font-semibold text-left">{post && post.title && post?.title.length > 0 && `${post?.title} | `}</p>
              <p className="text-left whitespace-pre-line">{post?.description}</p>
            </div>
            <div className="text-xs text-gray-500 mt-2">Posted on {post && format(post?.created_at, "dd/MM/yyyy HH:mm")}</div>
          </span>
        </span>

        <SideCommentSection 
        post_id={postId} 
        closeCommentSection={() => setPostModalId(null)}
        user_id={userId}
        className="flex flex-col h-full border-l  lg:h-[90vh]  lg:overflow-y-auto lg:scrollbar-hide cursor-pointer lg:min-w-130"
        hiddenCloseButton = "hidden lg:flex"/>
      </div>
    </div>
  )
}

export default DetailedPostModal