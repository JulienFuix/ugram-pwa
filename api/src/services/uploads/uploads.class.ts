import { BadRequest } from "@feathersjs/errors";
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from "@feathersjs/feathers";
import { Application } from "../../declarations";
const mimeTypes = require("mime-types");
const BlobService = require("feathers-blob");

interface Data {
  id: string;
  buffer?: any;
  mimetype?: any;
}

interface ServiceOptions {}

export class Uploads implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;
  upload: any;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.upload = BlobService(options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id: "test",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    const { id, buffer, mimetype } = data;
    const ext = mimeTypes.extension(mimetype);
    if (!buffer || !mimetype)
      throw new BadRequest(
        "Buffer or URI with valid content type must be provided to create a blob"
      );
    const prefix = params?.query?.type ? `${params.query.type}/` : "";
    return this.upload.create(
      { ...data, id: `${params?.folder || ""}${prefix}${id}.${ext}` },
      params
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: string, params?: Params): Promise<Data> {
    // return { id };
    return this.upload.remove(id);
  }
}
