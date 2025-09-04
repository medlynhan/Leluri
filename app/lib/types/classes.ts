import { Class } from ".";
import { MinimalInfoUser } from "./users";

export interface ClassWithCreator extends Class {
  creator: {
    id: string
    username: string
    image_url: string
    role: string
  }
}

export interface ClassCardInterface extends Class {
  creator: MinimalInfoUser
}