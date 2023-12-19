import * as feathersAuthentication from "@feathersjs/authentication";
import * as local from "@feathersjs/authentication-local";


const restrictEmail = require("../../hooks/restrictEmail");
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;
const handleImageUpload = require("../../hooks/handleImageUpload");
const joinImagesToUser = require("../../hooks/joinImagesToUser");
const concatUrlToBucketEndpoint = require("../../hooks/concatUrlToBucketEndpoint");

export default {
	before: {
		all: [],
		find: [authenticate("jwt"), joinImagesToUser()],
		get: [authenticate("jwt"), joinImagesToUser()],
		create: [hashPassword("password"), handleImageUpload()],
		update: [
			hashPassword("password"),
			authenticate("jwt"),
			handleImageUpload(),
		],
		patch: [hashPassword("password"), authenticate("jwt"), handleImageUpload()],
		remove: [authenticate("jwt")],
	},

	after: {
		all: [
			// Make sure the password field is never sent to the client
			// Always must be the last hook
			protect("password"),
			restrictEmail(),
		],
		find: [protect("email"), concatUrlToBucketEndpoint()],
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
