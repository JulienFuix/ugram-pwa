import { Forbidden } from "@feathersjs/errors";
import { ServiceAddons } from "@feathersjs/feathers";
import { Sequelize, Op } from "sequelize";
import { HookContext } from "../app";
import { Files } from "../services/files/files.class";
import { Hashtags } from "../services/hashtags/hashtags.class";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, data } = context;
    const user = params.user;
    params.sequelize = {
      attributes: {
        exclude: ["image_id", "updatedAt"],
      },
      include: [
        {
          model: (context.app.service("files") as Files & ServiceAddons<any>)
            .Model,
          as: "image",
          attributes: ["url"],
          required: true,
          duplicating: false,
        },
        {
          model: (
            context.app.service("hashtags") as Hashtags & ServiceAddons<any>
          ).Model,
          attributes: ["text", "id"],
          through: {
            attributes: [],
          },
        },
      ],
      nest: true,
      raw: false,
    };

    return context;
  };
};
