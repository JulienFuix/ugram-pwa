import * as authentication from "@feathersjs/authentication";
import { HooksObject } from "@feathersjs/feathers";
import { disallow } from "feathers-hooks-common";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const sendNotificationAfterAction = require("../../hooks/sendNotificationAfterAction");
export default {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [disallow()],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendNotificationAfterAction("LIKE")],
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
} as HooksObject;
