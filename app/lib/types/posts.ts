import { Post, PostMedia } from ".";
import { PostCommentWithReplies } from "./comments";
import { MinimalInfoUser } from "./user";

export interface DetailedPost extends Post {
    user: MinimalInfoUser
    posts_media: PostMedia[],
}

export interface DetailedPostWithComments extends Post {
    user: MinimalInfoUser
    posts_media: PostMedia[],
    posts_comments: PostCommentWithReplies[]
}