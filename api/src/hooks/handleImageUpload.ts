import { Forbidden } from "@feathersjs/errors";
import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, data } = context;
    const user = params.user;
    if (params.file) {
      try {
        let image = await context.app
          .service("files")
          .create({}, { file: params.file });
        context.data.image_id = image.id;
      } catch (e) {
        console.log("e", e);
      }
    }

    return context;
  };
};
