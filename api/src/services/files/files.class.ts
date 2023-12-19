import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from "@feathersjs/feathers";
import { Service, SequelizeServiceOptions } from "feathers-sequelize";
import { Application } from "../../declarations";

import { v4 as uuidv4 } from "uuid";
import { GeneralError } from "@feathersjs/errors";

interface Data {
  id?: Id | NullableId;
  url?: string;
}

interface ServiceOptions {}

export class Files extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return await super.find(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return await super.get(id, params);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<any> {
    try {
      if (params?.file) {
        let uploadedPhoto = await this.app.service("uploads").create(
          {
            ...params.file,
            id: uuidv4() + new Date().toISOString(),
          },
          { folder: "publications/" }
        );

        let res = await super.create({ url: uploadedPhoto.id }, {});
        return res;
      }
    } catch (e: any) {
      throw new GeneralError(e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    const file = await this._get(id as Id);
    const removedElement = await this.app.service("uploads").remove(file.url);
    return await super._remove(id);
  }
}
