import { ServiceAddons } from "@feathersjs/feathers";
import { HookContext } from "../app";
import { Files } from "../services/files/files.class";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { result } = context;

    context.params.sequelize = {
      include: [
        {
          model: (context.app.service("files") as Files & ServiceAddons<any>)
            .Model,
          as: "image",
          attributes: ["url"],
        },
      ],
      raw: false,
    };
  };
};
