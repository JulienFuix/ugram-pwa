import { Id, NullableId, Params } from "@feathersjs/feathers";
import { SequelizeServiceOptions, Service } from "feathers-sequelize";
import { Sequelize } from "sequelize";
import { Application } from "../../declarations";

type Data = {
  content: string;
  publication_id: string;
};

interface ServiceOptions {}

export class Comments extends Service {
  app: Application;

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async get(id: Id, params?: Params): Promise<any> {
    return await (
      this.app.get("sequelizeClient") as Sequelize
    ).models.comments.findOne({
      where: { id: id },
      attributes: ["id", "content", "publication_id", "createdAt"],
      include: [
        {
          model: (this.app.get("sequelizeClient") as Sequelize).models.users,
          as: "user",
          attributes: ["id", "name", "username"],
          include: [
            {
              model: (this.app.get("sequelizeClient") as Sequelize).models
                .files,
              as: "image",
              attributes: ["url"],
            },
          ],
        },
      ],
    });
  }

  async create(data: Data, params?: Params): Promise<Data> {
    return await this._create({ ...data, user_id: params?.user?.id }, params);
  }

  async find(params?: Params): Promise<any> {
    if (!params?.query?.publication_id)
      return { error: "publication_id is missing" };
    return await (
      this.app.get("sequelizeClient") as Sequelize
    ).models.comments.findAll({
      where: { publication_id: params?.query?.publication_id },
      attributes: ["id", "content", "publication_id", "createdAt"],
      include: [
        {
          model: (this.app.get("sequelizeClient") as Sequelize).models.users,
          as: "user",
          attributes: ["id", "name", "username", "image_id"],
          include: [
            {
              model: (this.app.get("sequelizeClient") as Sequelize).models
                .files,
              as: "image",
              attributes: ["url"],
            },
          ],
        },
      ],
      order: Sequelize.literal('comments."createdAt" ASC'),
      // raw: true,
      logging: true,
    });
  }

  async remove(id: NullableId, params?: Params): Promise<any> {
    const comments = await this.get(id as Id);
    if (comments.user.id == params?.user?.id) {
      return await this._remove(id, params);
    } else {
      return { error: "this isn't u'r publication" };
    }
  }
}
