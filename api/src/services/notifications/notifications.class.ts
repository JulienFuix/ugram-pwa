import { Params } from "@feathersjs/feathers";
import { Service, SequelizeServiceOptions } from "feathers-sequelize";
import { Application } from "../../declarations";

export class Notifications extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
  async create(
    data: Partial<any> | Partial<any>[],
    params?: Params | undefined
  ): Promise<any> {
    console.log("test creating notif");
    return await this._create(data, params);
  }
}
