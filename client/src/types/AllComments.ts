import { Comment } from "./Comment";

export type AllComments = {
    total: number,
    limit: number,
    skip: number,
    data: Array<Comment>
};  