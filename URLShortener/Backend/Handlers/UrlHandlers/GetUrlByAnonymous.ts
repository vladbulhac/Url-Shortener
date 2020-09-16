import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { ICacheRetrieveService } from "../../Services/CacheRetrieveServices/ICacheRetrieveService";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";

export async function GetUrlHandler(
  url: string,
  UrlRepository: IUrlRepository,
  CacheService: ICacheRetrieveService
): Promise<string> {
  let cachedUrl = await CacheService.QueryCacheForUrl(url);
  if (cachedUrl) {
    return cachedUrl;
  }
  const urlData: Url | null = await UrlRepository.GetByIdentifier(url);
  if (urlData) {
    await UrlRepository.UpdateTTL(url);
    CacheService.AddUrlToCache(url, urlData.trueUrl);
    return urlData.trueUrl;
  } else {
    throw new NotFoundError("Could not find this url");
  }
}
