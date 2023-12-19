// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
	return async (context: HookContext): Promise<HookContext> => {
		// c'est pas ultra propre(/degueulasse) mais ça me fait gagner au moin 5h donc :)
		for (let a in context.result.data) {
			let idPub: string = context.result.data[a].dataValues.id;
			let idUser: string | undefined = context?.params?.user?.id;
			let nbLike: number = (await context.app.service("likes")._find({
				query: {
					publication_id: idPub
				}
			})).total
			let nbComment: number = (await context.app.service("comments")._find({
				query: {
					publication_id: idPub
				}
			})).total
			context.result.data[a].dataValues.nbLike = nbLike
			context.result.data[a].dataValues.nbComment = nbComment
			if ((await context.app.service("likes")._find({
				query: {
					user_id: idUser, publication_id: idPub
				}
			})).total == 0)
				context.result.data[a].dataValues.isLiked = false
			else
				context.result.data[a].dataValues.isLiked = true
		}
		return context;
	};
};
