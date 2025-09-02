import { CommentReply, PostComment, User } from ".";
import { MinimalInfoUser } from "./user";

export interface PostCommentWithReplies extends PostComment {
    replies: (CommentReply & { user: MinimalInfoUser })[]
    user: MinimalInfoUser
}

export interface PostCommentWithUser extends PostComment {
    user: MinimalInfoUser
}

export interface PostCommentFormData {
    comment: string
}

export interface PostCommentInput extends PostCommentFormData {
    user_id: string
    post_id: string
}