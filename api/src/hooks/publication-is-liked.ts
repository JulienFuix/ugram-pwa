// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from "@feathersjs/feathers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    // c'est pas ultra propre(/degueulasse) mais ça me fait gagner au moin 5h donc :)
    let idPub: string = context.result.dataValues.id;
    let idUser: string | undefined = context?.params?.user?.id;
    let nbLike: number = (
      await context.app.service("likes")._find({
        query: {
          publication_id: idPub,
        },
      })
    ).total;
    context.result.dataValues.nbLikes = nbLike;
    if (idUser && idPub) {
      if (
        (
          await context.app.service("likes")._find({
            query: {
              user_id: idUser,
              publication_id: idPub,
            },
          })
        ).total == 0
      ) {
        context.result.dataValues.isLiked = false;
      } else {
        context.result.dataValues.isLiked = true;
      }
    }
    return context;
  };
};
