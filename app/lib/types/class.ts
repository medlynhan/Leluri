import { Class } from ".";

export interface ClassWithCreator extends Class {
    creator: {
        id: string
        username: string
        image_url: string
        role: string
    }
}