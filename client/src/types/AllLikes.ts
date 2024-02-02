import { Likes } from "./Likes";

export type AllLikes = {
    total: number,
    limit: number,
    skip: number,
    data: Array<Likes>
};  