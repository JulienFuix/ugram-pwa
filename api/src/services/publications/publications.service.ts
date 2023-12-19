// Initializes the `publications` service on path `/publications`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Publications } from "./publications.class";
import createModel from "../../models/publications.model";
import hooks from "./publications.hooks";
const multer = require("multer");
const multipartMiddleware = multer();

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    publications: Publications & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/publications",
    multipartMiddleware.single("file"),
    function (req: any, res: any, next: any) {
      req.feathers.file = req.file;
      next();
    },

    new Publications(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("publications");

  service.hooks(hooks);
}
