import * as authentication from "@feathersjs/authentication";
import publicationIsLiked from '../../hooks/publication-is-liked';
import publicationsIsLiked from '../../hooks/publications-is-liked';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const joinUserToPublicationOnCreate = require("../../hooks/joinUserToPublicationOnCreate");
const handleImageUpload = require("../../hooks/handleImageUpload");
const joinImageAndHashtagsToPublication = require("../../hooks/joinImageAndHashtagsToPublication");
const concatUrlToBucketEndpoint = require("../../hooks/concatUrlToBucketEndpoint");
const userIsOwnerOfPublication = require("../../hooks/userIsOwnerOfPublication");
const removeImagePublication = require("../../hooks/removeImagePublication");
const handleHashTagsPublication = require("../../hooks/handleHashTagsPublication");

export default {
	before: {
		all: [authenticate("jwt")],
		find: [joinImageAndHashtagsToPublication()],
		get: [joinImageAndHashtagsToPublication()],
		create: [joinUserToPublicationOnCreate(), handleImageUpload()],
		update: [userIsOwnerOfPublication()],
		patch: [userIsOwnerOfPublication()],
		remove: [userIsOwnerOfPublication()],
	},

	after: {
		all: [concatUrlToBucketEndpoint()],
		find: [publicationsIsLiked()],
		get: [publicationIsLiked()],
		create: [handleHashTagsPublication()],
		update: [],
		patch: [],
		remove: [removeImagePublication()],
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
