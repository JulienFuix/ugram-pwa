import { HooksObject } from "@feathersjs/feathers";
import * as authentication from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const joinPublicationsToHashTag = require("../../hooks/joinPublicationsToHashTag");
const concatUrlToBucketEndpoint = require("../../hooks/concatUrlToBucketEndpoint");

export default {
  before: {
    all: [],
    find: [disallow("external")],
    get: [joinPublicationsToHashTag()],
    create: [disallow("external")],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external")],
  },

  after: {
    all: [],
    find: [],
    get: [concatUrlToBucketEndpoint()],
    create: [],
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
