import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Sequelize } from 'sequelize';
import { Application } from '../../declarations';
const { Op } = require("sequelize");
interface Data { }

interface ServiceOptions { }

export class GetFamousUser implements Partial<ServiceMethods<Data>> {
	app: Application;
	options: ServiceOptions;

	constructor(options: ServiceOptions = {}, app: Application) {
		this.options = options;
		this.app = app;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async find(params?: Params): Promise<any> {
		if (!params?.query?.new_follower_id) return []
		return (await (this.app.get("sequelizeClient") as Sequelize).models.users.findAll({
			attributes: [
				'id',
				'name',
				'email',
				[Sequelize.literal('(SELECT COUNT(*) FROM user_following WHERE followed_id = "users".id)'), 'follower_count']
			],
			include: [{
				model: (this.app.get("sequelizeClient") as Sequelize).models.user_following,
				as: 'follower',
				where: {
					[Op.and]: [
						{ followed_id: params?.query?.new_follower_id }
					]
				}
			}],
			order: Sequelize.literal('"follower_count" DESC'),
			raw: true,
		}))
	}
}
