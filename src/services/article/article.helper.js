import { getStorage } from "../../utilities/storage";

export function generateCheckArticleApiParams(extensionId) {
  let params = {};

  if (extensionId !== undefined) {
    params.extensionGuid = extensionId;
  }

  return new Promise((resolve, reject) => {
    getStorage('prevArticleId').then(data => {
      if (data.prevArticleId !== undefined) {
        params.prevArticleId = +data.prevArticleId
      }

      resolve(params);
    });
  });
}