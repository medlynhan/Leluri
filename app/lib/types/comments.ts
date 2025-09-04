import { CommentReply, PostComment, User } from ".";
import { MinimalInfoUser } from "./users";

export interface PostCommentWithReplies extends PostComment {
    replies: (CommentReply & { user: MinimalInfoUser })[]
    user: MinimalInfoUser
}

export interface PostCommentWithUser extends PostComment {
    user: MinimalInfoUser
}

export interface PostCommentUserInput {
    comment: string
}

export interface PostCommentFormInput extends PostCommentUserInput {
    user_id: string
    post_id: string
}