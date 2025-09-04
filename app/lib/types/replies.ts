import { CommentReply } from ".";
import { MinimalInfoUser } from "./users";

export interface CommentRepliesWithUser extends CommentReply {
    user: MinimalInfoUser
}

export interface CommentReplyUserInput {
    reply: string
}

export interface CommentReplyFormInput extends CommentReplyUserInput {
    user_id: string
    comment_id: string
}