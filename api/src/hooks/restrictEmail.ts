import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { params, result } = context;
    const user = params.user;

    // Si aucun utilisateur n'est connecté, renvoyer une erreur

    // Si l'utilisateur connecté n'est pas l'auteur de la requête, masquer l'email
    if (result.id !== user?.id) {
      delete result.email;
    }
    return context;
  };
};
