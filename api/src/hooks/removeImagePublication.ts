import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { result } = context;

    await context.app.service("files").remove(result.image_id);
    return context;
  };
};
