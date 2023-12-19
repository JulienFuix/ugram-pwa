import { Forbidden } from "@feathersjs/errors";
import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, id } = context;
    const user = params.user;

    if (user?.id !== id) {
      throw new Forbidden("You cant do this action");
    }

    return context;
  };
};
