import { User } from "./User";
import { Message } from "./Message";

export type Conversation = {
    id: string,
    createdAt: Date,
    creator_id: string;
    receiver_id: string,
    updatedAt: Date,
    receiver: User,
    creator: User,
    lastMessage: Array<Message>
};
  