import { Params } from '@feathersjs/feathers';
import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class Messages extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: Partial<any> | Partial<any>[], params?: Params): Promise<any> {
    console.log("createMessage", data, params?.user?.id);  
    return await this._create({...data, sender_id: params?.user?.id, send_at: new Date}, params);
  }
}
