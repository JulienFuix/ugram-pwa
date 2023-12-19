import * as authentication from "@feathersjs/authentication";
import { disallow, required } from "feathers-hooks-common";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const joinUserOnFollowing = require("../../hooks/joinUserOnFollowing");
const sendNotificationAfterAction = require("../../hooks/sendNotificationAfterAction");

export default {
  before: {
    all: [disallow("external")],
    find: [],
    get: [],
    create: [required("followed_id"), joinUserOnFollowing()],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendNotificationAfterAction("FOLLOW")],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
