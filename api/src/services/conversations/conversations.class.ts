import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Sequelize, Op } from 'sequelize';

export class Conversations extends Service {
    private app;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }
  
async find(params?: Params): Promise<any> {
    const sequelize = this.app.get("sequelizeClient") as Sequelize;
    const result = await sequelize.models.conversations.findAndCountAll({
        where: {
            [Op.or]: [
                { creator_id: params?.user?.id },
                { receiver_id: params?.user?.id }
            ]
        },
        include: [
            {
                model: sequelize.models.users,
                attributes: ['id', 'name', 'email', 'username', 'image_id'],
                as: "receiver",
                include: [
                    {
                        model: (this.app.get("sequelizeClient") as Sequelize).models
                            .files,
                        as: "image",
                        attributes: ["url"],
                    },
                ],
            },
            {
                model: sequelize.models.users,
                attributes: ['id', 'name', 'email', 'username', 'image_id'],
                as: "creator",
                include: [
                    {
                        model: (this.app.get("sequelizeClient") as Sequelize).models
                            .files,
                        as: "image",
                        attributes: ["url"],
                    },
                ],
            },
            {
                model: sequelize.models.messages,
                attributes: ['id', 'text', 'send_at', 'sender_id', 'conversation_id'],
                as: "lastMessage",
                order: [['send_at', 'DESC']],
                limit: 1
            }
        ]
    });

    return {
        total: result.count,
        limit: result.count,
        skip: 0,
        data: result.rows
    };
}

}
