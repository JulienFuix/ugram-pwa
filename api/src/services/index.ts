import { Application } from "../declarations";
import users from "./users/users.service";
import userFollowing from "./user_following/user_following.service";
import publications from "./publications/publications.service";
import files from "./files/files.service";
import uploads from "./uploads/uploads.service";
import hashtags from './hashtags/hashtags.service';
import publicationsHashtags from './publications_hashtags/publications_hashtags.service';
import search from './search/search.service';
import likes from './likes/likes.service';
import getFamousUser from './get-famous-user/get-famous-user.service';
import comments from './comments/comments.service';
import notifications from './notifications/notifications.service';
import conversations from './conversations/conversations.service';
import messages from './messages/messages.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(userFollowing);
  app.configure(publications);
  app.configure(files);
  app.configure(uploads);
  app.configure(hashtags);
  app.configure(publicationsHashtags);
  app.configure(search);
  app.configure(likes);
  app.configure(getFamousUser);
  app.configure(comments);
  app.configure(notifications);
  app.configure(conversations);
  app.configure(messages);
}
