import { Post, PostMedia } from ".";
import { PostCommentWithReplies } from "./comments";
import { MinimalInfoUser } from "./user";

export interface DetailedPostWithMedia extends Post {
    user: MinimalInfoUser
    posts_media: PostMedia[],
}

export interface DetailedPostWithComments extends Post {
    user: MinimalInfoUser
    posts_media: PostMedia[],
    posts_comments: PostCommentWithReplies[]
}

export interface PostFormData {
    title : string,
    description : string,
    category_id : string,
}

export interface PostInput extends PostFormData {
    user_id : string,
    posts_media: any[]
}