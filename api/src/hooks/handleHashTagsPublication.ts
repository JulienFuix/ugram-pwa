import { Forbidden, Unprocessable } from "@feathersjs/errors";
import { Paginated } from "@feathersjs/feathers";
import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, result, data } = context;
    const user = params.user;

    if (data.hashtags) {
      if (!Array.isArray(data.hashtags)) {
        throw new Unprocessable(
          "Bad hashtags format, it must be : Array<string>"
        );
      }
      data.hashtags.map(async (item: string) => {
        let existing = await context.app
          .service("hashtags")
          .find({ query: { text: item } });
        if ((existing as Paginated<any>).data[0]) {
          await context.app
            .service("publications-hashtags")
            .create({
              publication_id: result.id,
              hashtag_id: (existing as Paginated<any>).data[0].id,
            });
        } else {
          let hashtag = await context.app
            .service("hashtags")
            .create({ text: item });
          await context.app
            .service("publications-hashtags")
            .create({ publication_id: result.id, hashtag_id: hashtag.id });
        }
      });
    }
    return context;
  };
};
