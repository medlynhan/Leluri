import { CommentReply, PostComment, User } from ".";
import { MinimalInfoUser } from "./user";

export interface PostCommentWithReplies extends PostComment {
    replies: (CommentReply & { user: MinimalInfoUser })[]
    user: MinimalInfoUser
}