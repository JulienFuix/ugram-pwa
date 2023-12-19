import { FollowObject } from './FollowObject';
export type AllFollowObject = {
  total: number,
  limit: number,
  skip: number,
  data: Array<FollowObject>
};
