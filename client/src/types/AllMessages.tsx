import { Message } from "./Message";

export type AllMessage = {
    total: number,
    limit: number,
    skip: number,
    data: Array<Message>
};  