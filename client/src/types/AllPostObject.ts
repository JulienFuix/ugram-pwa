import { Post } from "./Post";

export type AllPostObject = {
  total: number,
  limit: number,
  skip: number,
  data: Array<Post>
};
