import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Card, CardContent } from "./ui/card"
import { Heart, MessageSquare } from "lucide-react"
import { DetailedPostWithMedia } from "@/lib/types/posts"
import MediaCarousel from "./MediaCarousel"
import { useCreatePostLike, useDeletePostLike } from "@/lib/client-queries/postlikes"
import { Button } from "./ui/button"
import { AchievementRow, evaluateAchievements, recordAction } from "@/lib/achievements"
import { useState } from "react"
import AchievementUnlockModal from "./modal/AchievementUnlockModal"

interface PostCard {
  post: DetailedPostWithMedia,
  onClick?: (...args: any[]) => void,
  onCommentClick?: (...args: any[]) => void,
  onLikeClick?: (...args: any[]) => void,
  userId: string
}

const PostCard = ({ 
  post,
  onClick,
  onCommentClick,
  onLikeClick,
  userId
} : PostCard) => {

  const { mutateAsync: createPostLike, isPending: isCreatePostLikePending, isError: isCreatePostLikeError, error: createPostLikeError} = useCreatePostLike()
  const { mutate: deletePostLike, isPending: isDeletePostLikePending, isError: isDeletePostLikeError, error: deletePostLikeError} = useDeletePostLike()

  const [unlockQueue, setUnlockQueue] = useState<AchievementRow[]>([])

  const handleSelfLike = async () => {
    if(post.liked){
      deletePostLike({
        user_id: userId,
        post_id: post.id
      })
    }else{
      const newlyUnlockedAchievements = await createPostLike({
        user_id: userId,
        post_id: post.id
      })
      setUnlockQueue((prev) => [...prev, ...newlyUnlockedAchievements])
    }
  }

  return (
    <Card 
    key={post.id} className="overflow-hidden border-0 shadow-sm p-0 gap-0 h-86"
    onClick={() => onClick && onClick()}>
      <MediaCarousel posts_media={[post.posts_media[0]]}/>

      <CardContent className="flex py-2 px-4 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src={post.user.image_url || "/placeholder.svg"} />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{post.user.username}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{post.user.role}</p>
            </div>
          </div>

          <div className="flex items-center text-gray-500">
            <Button
            className="flex items-center gap-1 hover hover:bg-gray-100 rounded-md"
            variant="ghost"
            disabled={isCreatePostLikePending || isDeletePostLikePending}
            onClick={(e) => {
              e.stopPropagation()
              onLikeClick ? onLikeClick() : handleSelfLike()
            }}>
              <Heart className={`w-4 h-4 ${post.liked ? "text-red-500 fill-current" : "text-gray-300 fill-current"}`} />
              <span className="text-sm">{post.likes}</span>
            </Button>
            <Button
            className="flex items-center gap-1 hover:bg-gray-100 rounded-lg"
            variant="ghost"
            onClick={() => onCommentClick && onCommentClick()}>
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comment_count}</span>
            </Button>
          </div>

          <AchievementUnlockModal
            queue={unlockQueue.map(a => ({ id: a.id, name: a.name, description: a.description, badge_icon: a.badge_icon }))}
            onClose={(id) => setUnlockQueue(q => q.filter(x => x.id !== id))}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard
