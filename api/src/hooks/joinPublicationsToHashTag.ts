import { ServiceAddons } from "@feathersjs/feathers";
import { HookContext } from "../app";
import { Files } from "../services/files/files.class";
import { Publications } from "../services/publications/publications.class";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, data } = context;
    params.sequelize = {
      attributes: ["id", "text"],
      include: [
        {
          model: (
            context.app.service("publications") as Publications &
              ServiceAddons<any>
          ).Model,
          attributes: ["id", "description"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: (
                context.app.service("files") as Files & ServiceAddons<any>
              ).Model,
              as: "image",
              attributes: ["url"],
            },
          ],
        },
      ],
      all: true,
      nest: true,
      raw: false,
    };

    return context;
  };
};
