import { Forbidden, NotFound } from "@feathersjs/errors";
import { Id } from "@feathersjs/feathers";
import { HookContext } from "../app";

module.exports = (type: string) => {
  return async (context: HookContext<any>) => {
    const { params, id, result } = context;
    const user = params.user;
    console.log("trying :", type);
    try {
      if (type === "COMMENT") {
        const publication = await context.app
          .service("publications")
          .get(result.publication_id);
        await context.app.service("notifications").create({
          type: "COMMENT",
          text: result.content,
          associate_user_id: result.user_id,
          receiver_id: publication.user_id,
          publication_id: publication.id,
        });
      }
      if (type === "LIKE") {
        const publication = await context.app
          .service("publications")
          .get(result.publication_id);
        await context.app.service("notifications").create({
          type: "LIKE",
          text: null,
          associate_user_id: result.user_id,
          receiver_id: publication.user_id,
          publication_id: publication.id,
        });
      }
      if (type === "FOLLOW") {
        await context.app.service("notifications").create({
          type: "FOLLOW",
          text: null,
          associate_user_id: result.user_id,
          receiver_id: result.followed_id,
          publication_id: null,
        });
      }
      if (type === "MESSAGE") {
        await context.app.service("notifications").create({
          type: "MESSAGE",
          text: result.text,
          associate_user_id: result.sender_id,
          receiver_id: user?.id,
          send_at: result.send_at,
        });
      }
    } catch (e) {
      console.log("error", e);
    }

    return context;
  };
};
