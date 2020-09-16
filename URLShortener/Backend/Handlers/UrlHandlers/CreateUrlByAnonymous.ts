import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { ICacheRetrieveService } from "../../Services/CacheRetrieveServices/ICacheRetrieveService";
import { IUrlConversionService } from "../../Services/UrlServices/IUrlConversionService";

export async function CreateUrlHandler(
  url: string,
  UrlRepository: IUrlRepository,
  UrlConversionService: IUrlConversionService,
  CacheService: ICacheRetrieveService
): Promise<string> {
  let cachedUrl = await CacheService.QueryCacheForUrl(url);
  if (cachedUrl) 
    return cachedUrl;

  const existingUrl: Url | null = await UrlRepository.GetByIdentifier(url);
  if (existingUrl) {
    CacheService.AddUrlToCache(existingUrl.shortUrl, existingUrl.trueUrl);
    return existingUrl.shortUrl;
  }

  const shortUrl: string = UrlConversionService.ShortUrl(url);
  const newUrl: any = {
    trueUrl: url,
    shortUrl: shortUrl,
    accessNumber: 1,
  };
  await UrlRepository.Add(newUrl);
  return shortUrl;
}
