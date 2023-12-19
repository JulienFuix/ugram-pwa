export type Post = {
  id: string,
  description: string,
  createdAt: Date;
  user_id: string,
  image: {
    url: string;
  },
  hashtags: Array<string>
};
