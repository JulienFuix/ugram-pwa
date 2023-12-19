// Initializes the `uploads` service on path `/uploads`
import { ServiceAddons } from "@feathersjs/feathers";
import app from "../../app";
import { Application } from "../../declarations";
import { Uploads } from "./uploads.class";
import hooks from "./uploads.hooks";

const AWS = require("aws-sdk");

const S3BlobStore = require("s3-blob-store");

const fs = require("fs-blob-store");

// File storage location. Folder must be created before upload.
// Example: './uploads' will be located under feathers app top level.
const blobStorage = fs("/uploads");

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    uploads: Uploads & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const s3 = new AWS.S3({
    accessKeyId:
      // process.env.AWS_ACCESS_KEY_ID ||
      app.get("aws").s3.accessKeyId,

    secretAccessKey:
      // process.env.AWS_SECRET_ACCESS_KEY ||
      app.get("aws").s3.secretAccessKey,
  });

  const blobStore = S3BlobStore({
    client: s3,
    bucket: app.get("aws").s3.bucketName,
  });

  const options = {
    Model: blobStore,
    returnUri: false,
  };

  // Initialize our service with any options it requires
  app.use("/uploads", new Uploads(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("uploads");

  service.hooks(hooks);
}
