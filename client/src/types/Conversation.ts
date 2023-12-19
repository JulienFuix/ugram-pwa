import { User } from "./User";

export type Conversation = {
    id: string,
    createdAt: Date,
    creator_id: string;
    receiver_id: string,
    updatedAt: Date,
    receiver: User,
    creator: User,
};
  