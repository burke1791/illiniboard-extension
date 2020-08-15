import { generateCheckArticleApiParams } from "./article.helper";
import { apiGet } from "../../utilities/apiService";
import { ENDPOINTS } from "../../utilities/constants";

export async function fetchNewArticles(extensionId) {
  if (extensionId === undefined) {
    throw new Error('Please supply an extensionId');
  }

  try {
    let apiParams = await generateCheckArticleApiParams(extensionId);
    let articleArr = await apiGet(ENDPOINTS.CHECK_NEW_ARTICLES, apiParams);

    articleArr = JSON.parse(articleArr);
    return articleArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}