import { Forbidden, NotFound } from "@feathersjs/errors";
import { Id } from "@feathersjs/feathers";
import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, id } = context;
    const user = params.user;

    const publication = await context.app.service("publications").get(id as Id);

    if (!publication) {
      throw new NotFound("This publication does not exists");
    }
    if (user?.id !== publication.user_id) {
      throw new Forbidden("You cant do this action");
    }

    return context;
  };
};
