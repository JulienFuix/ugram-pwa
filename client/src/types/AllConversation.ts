import { Conversation } from "./Conversation";

export type AllConversation = {
  total: number,
  limit: number,
  skip: number,
  data: Array<Conversation>
};
