import { Paginated, Params } from '@feathersjs/feathers';
import { SequelizeServiceOptions, Service } from 'feathers-sequelize';
import { Sequelize } from 'sequelize';
import { Application } from '../../declarations';

type Data = any;

export class Likes extends Service {
	app: Application;

	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
		super(options);
		this.app = app;
	}

	async find(params?: Params | undefined): Promise<any[] | Paginated<any>> {
		const sequelize = this.app.get("sequelizeClient") as Sequelize;
		const result = await sequelize.models.likes.findAndCountAll({
			where: {
				publication_id: params?.query?.publication_id
			},
			include: [{
				model: sequelize.models.users,
				attributes: ['id', 'name', 'email', 'username', 'image_id'],
				as: "lover",
				include: [
					{
						model: (this.app.get("sequelizeClient") as Sequelize).models
							.files,
						as: "image",
						attributes: ["url"],
					},
				],
			}],
		});

		return {
			total: result.count,
			limit: result.count,
			skip: 0,
			data: result.rows
		};
	}

	async create(data: Data, params?: any): Promise<Data> {
		let isExist = (await this._find({
			query: {
				user_id: params?.user?.id,
				publication_id: data.publication_id
			}
		})).total != 0;

		if (isExist) {
			return {
				"error": "you have already liked this publication"
			};
		}
		else return await this._create({ ...data, user_id: params.user.id }, params);
	}

	async remove(id: null, params?: any): Promise<Data> {
		let id_pub = (await this._find({
			query: {
				user_id: params?.user?.id,
				publication_id: params?.query?.publication_id
			}
		}))?.data[0]?.id
		if (id_pub === undefined) {
			return { "error": "This Publication wasn't like" }
		}
		return await this._remove(id_pub);
	}
}
