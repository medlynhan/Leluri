import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Card, CardContent } from "./ui/card"
import { Heart, MessageSquare, Play } from "lucide-react"
import { DetailedPost } from "@/lib/types/posts"
import MediaCarousel from "./MediaCarousel"

interface PostCard {
  post: DetailedPost,
  onClick?: (...args: any[]) => void
}

const PostCard = ({ 
  post,
  onClick
} : PostCard) => {

  return (
    <Card 
    key={post.id} className="overflow-hidden border-0 shadow-sm p-0 gap-0 h-86"
    onClick={() => onClick && onClick()}>
      <MediaCarousel posts_media={[post.posts_media[0]]}/>

      <CardContent className="flex py-2 px-4 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src={post.user.image_url || "/placeholder.svg"} />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{post.user.username}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{post.user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.like_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comment_count}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard
