import { Service } from 'feathers-sequelize';
import { Application } from '../../declarations';

interface ServiceOptions { }
type Data = any
export class Users extends Service {
	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(options: ServiceOptions = {}, app: Application) {
		super(options)
	}


	async create(data: Data, params?: any): Promise<Data> {
		if (data.mode === "local") return await this._create(data, params);
		else if (data.mode === undefined) return await this._create({ ...data, mode: "oauth", name: "", }, params);
	}
}
