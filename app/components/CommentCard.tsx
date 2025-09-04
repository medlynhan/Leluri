import { useGetCommentReplies } from "@/lib/client-queries/commentreplies"
import { CommentReply } from "@/lib/types"
import { PostCommentWithUser } from "@/lib/types/comments"
import { MinimalInfoUser } from "@/lib/types/users"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import LoadingComponent from "./LoadingComponent"

interface CommentCard {
  comment : PostCommentWithUser,
  onReplyClicked: (id : string, username : string) => void
}

const CommentCard = ({ 
  comment,
  onReplyClicked
} : CommentCard) => {

  const { data: replies = [], isLoading, isError: isGetCommentRepliesError, error: getCommentRepliesError } = useGetCommentReplies(comment.id)

  const [isRepliesOpened, setIsRepliesOpened] = useState<boolean>(false)

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReplyClicked(comment.id, comment.user.username);
  }

  if(isLoading) return <LoadingComponent message=""/>

  return (
    <div className="p-4 border-b">
      <div className="flex gap-3">
        <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
          <AvatarImage src="/simple-green-leaf-logo.png" />
          <AvatarFallback>{comment.user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <span className="flex flex-row">
            <div className="text-xs text-gray-500 mb-1 mr-auto line-clamp-1 truncate">{comment.user.role}</div>
            <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</div>
          </span>
          <div className="font-semibold text-xs mb-1">{comment.user.username}</div>
          <div className="text-xs mb-2">{comment.comment}</div>
          <div className="flex flex-row text-gray-400 text-xs gap-3">
            <span className="cursor-pointer" onClick={(e) => handleReplyClick(e)}>reply</span>
            <span onClick={() => setIsRepliesOpened(!isRepliesOpened)} className="cursor-pointer">
              {isRepliesOpened ? `v hide` : '> see'} replies
            </span>
          </div>
          {isRepliesOpened && replies.map((reply) => (
            <ReplyCard reply={reply} user={reply.user} key={reply.id}/>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ReplyCard {
  reply : CommentReply
  user : MinimalInfoUser
}

const ReplyCard = ({ 
  reply,
  user 
} : ReplyCard) => {
  return (
    <div key={reply.id}>
      <div className="flex gap-3 pt-4">
        <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
          <AvatarImage src="/simple-green-leaf-logo.png" />
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <span className="flex flex-row">
            <div className="text-xs text-gray-500 mb-1 mr-auto line-clamp-1 truncate">{user.role}</div>
            <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</div>
          </span>
          <div className="font-semibold text-xs mb-1">{user.username}</div>
          <div className="text-xs mb-2">{reply.reply}</div>
        </div>
      </div>
    </div>
  )
}

export default CommentCard