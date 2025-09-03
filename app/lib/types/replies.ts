import { CommentReply } from ".";
import { MinimalInfoUser } from "./user";

export interface CommentRepliesWithUser extends CommentReply {
    user: MinimalInfoUser
}

export interface CommentReplyFormData {
    reply: string
}

export interface CommentReplyInput extends CommentReplyFormData {
    user_id: string
    comment_id: string
}