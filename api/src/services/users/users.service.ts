// Initializes the `users` service on path `/users`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Users } from "./users.class";
import createModel from "../../models/users.model";
import hooks from "./users.hooks";
const multer = require("multer");
const multipartMiddleware = multer();

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    users: Users & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/users",
    multipartMiddleware.single("file"),
    function (req: any, res: any, next: any) {
      req.feathers.file = req.file;
      next();
    },
    new Users(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("users");

  service.hooks(hooks);
}
