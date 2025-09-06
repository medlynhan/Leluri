import { Send, X } from "lucide-react"
import { Button } from "./ui/button"
import CommentCard from "./CommentCard"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Input } from "./ui/input"
import { useCreateComment, useGetPostComments } from "@/lib/client-queries/postcomments"
import { useState, useEffect } from "react"
import LoadingComponent from "./LoadingComponent"
import { useCreateReply } from "@/lib/client-queries/commentreplies"
import { supabase } from "@/lib/supabase"


interface SideCommentSectionInterface {
  post_id: string,
  user_id: string,
  closeCommentSection: () => void,
  className?: string;
  hiddenCloseButton? : string;
}

interface Replying {
  username: string
  id: string
}

const SideCommentSection = ({
  post_id,
  user_id,
  closeCommentSection,
  className = '',
  hiddenCloseButton = ''
  
} : SideCommentSectionInterface) => {

  const { data: comments = [], isLoading, isError: isGetPostCommentsError, error: getPostCommentsError } = useGetPostComments(post_id)
  const { mutate: createNewComment, isPending: isPendingCreateNewComment, isError: isCreateCommentError, error: createCommentError } = useCreateComment()
  const { mutate: createNewReply, isPending: isPendingCreateNewReply, isError: isCreateReplyError, error: createReplyError } = useCreateReply()
  
  const [comment, setComment] = useState<string>('')
  const [replyReceipient, setReplyReceipient] = useState<Replying|null>(null)

  const handleSubmitComment = () => {
    if(!comment || comment.length <= 0) return
    if(replyReceipient === null){
      createNewComment({
        post_id: post_id,
        user_id: user_id,
        comment: comment
      })
    }else{
      createNewReply({
        comment_id: replyReceipient.id,
        user_id: user_id,
        reply: comment
      })
    }
    setComment('')
  }

    const [currentUser, setCurrentUser] = useState<{id: string, image_url: string, username: string} | null>(null);

    useEffect(() => {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('id, image_url, username')
          .eq('id', user_id)
          .single();

        if (!error && data) setCurrentUser(data);
      };
      fetchUser();
    }, [user_id]);

  if(isLoading) return <LoadingComponent message="loading post comments..."/>
  
  return (




    <div className={`${className}`}>
      <div className=" p-4 border-b flex items-center justify-between">
        <h3 className="flex items-center font-semibold  h-full">Comments ({comments.length})</h3>
        <button
          onClick={closeCommentSection}
          className={` p-1 h-full rounded-full hover:bg-[var(--light-grey)] transition-colors ${hiddenCloseButton}`}
          aria-label="Tutup"
        >
          <X className="w-5 h-5 text-[var(--black)] " />
        </button>
      </div>

      <div className="top-0 flex-1 overflow-y-auto scrollbar-hide">
        <div>

        </div>
        {comments.map((comment) => (
          <CommentCard comment={comment} key={comment.id} onReplyClicked={(id : string, username : string) => setReplyReceipient({ id: id, username: username })}/>
        ))}
      </div>

      <div className="relative p-4 border-t">
        {(replyReceipient !== null) && <div className="mr-auto absolute items-center px-4 flex flex-row w-full h-3/4 bg-gray-200 top-[-75%] left-0">
          <span className="text-sm text-gray-400">Now Replying to <span className="font-semibold">{replyReceipient.username}</span></span> 
          <Button variant="ghost" size="sm" onClick={() => setReplyReceipient(null)}
          className="rounded-full h-8 w-8 ml-auto">
            <X className="w-5 h-5"/>
          </Button>
        </div>}
        <div className=" flex gap-2">
          
          <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
            <AvatarImage src={currentUser?.image_url || "/user-profile-illustration.png"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input placeholder="Add comments..." className="flex-1 text-sm"
            value={comment} onChange={(e) => setComment(e.target.value)}/>
            <Button size="sm" className="px-3" onClick={handleSubmitComment} disabled={isPendingCreateNewComment}>
              <Send className="w-4 h-4"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideCommentSection