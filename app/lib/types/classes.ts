import { Class } from ".";
import { MinimalInfoUser } from "./user";

export interface ClassWithCreator extends Class {
  creator: {
    id: string
    username: string
    image_url: string
    role: string
    rating?: Float16Array
  }
}

export interface ClassCardInterface extends Class {
  creator: MinimalInfoUser
}