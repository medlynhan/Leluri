
export interface User {
  id: string;
  username: string;
  email: string;
  image_url?: string | null;
  biography?: string | null;
  location?: string | null;
  role: string;
  created_at: string;
  phone_number?: string | null;
}

export interface Category {
  id: string;
  name: string;
}

export interface ClassCategory extends Category {
  created_at: string;
}

export interface PostCategory extends Category {
  created_at: string;
}

export interface Achievement {
  id: string;
  image_url: string;
  title: string;
  task: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  price: number;
  created_at: string;
  image_url: string;
  description: string;
  stock: number;
  length: number;
  width: number;
  thickness: number;
  rating?: number | null;
}

export interface ProductRating {
  id: string;
  rating: number;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ProductInCart {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface ShoppingCart {
  id: string;
  user_id: string;
  payment_method: number;
  has_paid: boolean;
  total_cost: number;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  user_id: string;
  description: string;
  created_at: string;
  category_id: string;
  likes: number;
  comment_count: number;
  liked?: boolean
}

export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export interface CommentReply {
  id: string;
  comment_id: string;
  user_id: string;
  reply: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  creator_id: string;
  avg_rating: number;
  image_url: string;
  description: string;
  location: string;
  created_at: string;
  category_id: string;
}

export interface ClassMentee {
  id: string;
  user_id: string;
  class_id: string;
  created_at: string;
  is_verified?: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  created_at: string;
}

export interface PostMedia {
  id: string;
  post_id: string;
  media_type: string;
  media_url: string;
  created_at: string;
  is_main: boolean;
}

export interface UserFollower {
  id: string;
  following_id: string;
  follower_id: string;
  created_at: string;
}