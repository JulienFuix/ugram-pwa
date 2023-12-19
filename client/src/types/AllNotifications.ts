import { Notifications } from './Notifications';
export type AllNotifications = {
  total: number,
  limit: number,
  skip: number,
  data: Array<Notifications>
};
