import { Forbidden } from "@feathersjs/errors";
import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, data } = context;
    const user = params.user;

    context.data.user_id = user?.id;

    return context;
  };
};
