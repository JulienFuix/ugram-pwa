import { HookContext } from "../app";

module.exports = (options = {}) => {
  return async (context: HookContext<any>) => {
    const { result } = context;
    if (result.data) {
      if (Array.isArray(result.data)) {
        result.data.forEach((current: any) => {
          if (current.image)
            current.image.url =
              context.app.get("aws").s3.bucketUrl + current.image.url;
          if (current.user && current.user.image && current.user.image.url) {
            current.user.image.url =
              context.app.get("aws").s3.bucketUrl + current.user.image.url;
          }
        });
      }
    }
    if (result.image && result.image.url) {
      result.image.url = context.app.get("aws").s3.bucketUrl + result.image.url;
    }
    if (result.publications) {
      result.publications.forEach(
        (current: any) =>
          (current.image.url =
            context.app.get("aws").s3.bucketUrl + current.image.url)
      );
    }
    if (result.user && result.user.image && result.user.image.url) {
      result.user.image.url =
        context.app.get("aws").s3.bucketUrl + result.user.image.url;
    }
    return context;
  };
};
