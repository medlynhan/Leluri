import { User } from "."
import { AchievementRow } from "../achievements"

export interface MinimalInfoUser {
    id: string,
    username: string,
    image_url: string,
    role: string
    followed?: boolean
}

export interface UserProfile extends User {
    detailedAchievements: AchievementRow[]
}

export interface UserProfileUserInput {
    image_url: string
    username: string
    role?: string
    biography?: string
    location?: string
    phone_number?: string
    role_id?: string
}

export interface UserProfileFormInput extends UserProfileUserInput {
    id: string
}
