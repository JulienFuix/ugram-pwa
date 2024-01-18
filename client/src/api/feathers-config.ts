import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import displayToastErrorByErrorCode from "../utils/errors-management";

const feathers = require("@feathersjs/feathers");

export const app = feathers();
const auth = require("@feathersjs/authentication-client");
const socket = io(process.env.vars.NEXT_PUBLIC_API_URL || "", {
  transports: ["websocket"],
  forceNew: true,
});

const options = {};
app.configure(socketio(socket));
app.configure(auth(options));

export const HTTPRequest = async (
  methodHTTP = "",
  service = "",
  params: { _id?: any; query?: any; data?: any } = {
    _id: undefined,
    query: undefined,
    data: undefined,
  },
  header = { "Content-Type": "application/json" }
) => {
  let result: any;
  try {
    switch (methodHTTP) {
      case "find":
        result = await app.service(service).find(params, { headers: header });
        break;
      case "get":
        result = await app
          .service(service)
          .get(params._id, params, { headers: header });
        break;
      case "create":
        result = await app
          .service(service)
          .create(params.data, { headers: header });
        break;
      case "update":
        result = await app
          .service(service)
          .update(params._id, params.data, params.query || null, {
            headers: header,
          });
        break;
      case "patch":
        result = await app
          .service(service)
          .patch(params._id, params.data, params.query || null, {
            headers: header,
          });
        break;
      case "remove":
        result = await app
          .service(service)
          .remove(params._id, params, { headers: header });
        break;
      default:
        break;
    }
  } catch (e: any) {
    console.log(e);
    displayToastErrorByErrorCode(e.data?.errorCode || "400");
    throw e;
  }
  return result;
};

export default app;
