import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface Data { }

interface ServiceOptions { }

export class Search implements Partial<ServiceMethods<Data>> {
	app: Application;
	options: ServiceOptions;

	constructor(options: ServiceOptions = {}, app: Application) {
		this.options = options;
		this.app = app;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async find(params?: Params): Promise<any> {
		if (!params) params = {};
		if (!params.query) params.query = {};
		if (!params?.query?.$title) params.query.$title = '';

		const queryUsers = {
			$sort: { createdAt: -1 },
			$or: [{ 'name': { $like: '%' + params?.query?.$title + '%' } }, { 'username': { $like: '%' + params?.query?.$title + '%' } }],
		};
		const queryPublicationDescription = {
			$sort: { createdAt: -1 },
			$or: [{ 'description': { $like: '%' + params?.query?.$title + '%' } }],
		};
		const queryHastag = {
			$sort: { createdAt: -1 },
			$or: [{ 'text': { $like: '%' + params?.query?.$title + '%' } }],
		};
		let hashtags = await this.app.service("hashtags")._find({ query: queryHastag });
		let arrIdHastags = hashtags.data.map((it: any) => it.id)
		const queryPublicationHasHastag = {
			$sort: { createdAt: -1 },
			$or: [{ 'hashtag_id': { $in: arrIdHastags } }],
		};
		let publication_has_hastags = await this.app.service('publications-hashtags')._find({ query: queryPublicationHasHastag })
		let arrIdPublication = publication_has_hastags.data.map((it: any) => it.publication_id)
		const queryPublicationHastag = {
			$sort: { createdAt: -1 },
			'id': { $in: arrIdPublication },
		};
		const data: Data = {
			users: await this.app.service('users')._find({ query: queryUsers }),
			publicationsDescription: await this.app.service('publications')._find({ query: queryPublicationDescription }),
			artists: await this.app.service('publications')._find({ query: queryPublicationHastag }),
		};

		return data;
	}
}
