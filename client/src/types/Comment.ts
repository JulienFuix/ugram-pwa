import { User } from "./User";

export type Comment = {
    id: string,
    content: string,
    publication_id: string,
    createdAt: Date,
    user: User,
};
