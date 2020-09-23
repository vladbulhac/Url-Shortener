import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { IUrlConversionService } from "../../Services/UrlServices/IUrlConversionService";

export async function CreateUrlHandler(
  url: string,
  UrlRepository: IUrlRepository,
  UrlConversionService: IUrlConversionService,
  CacheService: ICacheService
): Promise<string> {

  let cachedUrl = await CacheService.QueryCacheForUrl(url);
  if (cachedUrl) return cachedUrl;


  const existingUrl: Url | null = await UrlRepository.GetByIdentifier(url);
  if (existingUrl) {
    if (existingUrl.isActive === false)
      await UrlRepository.DeleteByIdentifier(existingUrl.shortUrl);
    else return existingUrl.shortUrl;
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
