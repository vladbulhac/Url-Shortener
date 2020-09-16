import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheRetrieveService } from "../../Services/CacheRetrieveServices/ICacheRetrieveService";
import { IUrlConversionService } from "../../Services/UrlServices/IUrlConversionService";

export async function CreateUrlByUserHandler(
  userId: string,
  url: string,
  UrlRepository: IUrlRepository,
  UserRepository: IUserRepository,
  UrlConversionService: IUrlConversionService,
  CacheService: ICacheRetrieveService,
  customUrl: string | undefined | null
): Promise<string> {
  let cachedUrl = await CacheService.QueryCacheForUrl(url);
  if (cachedUrl) 
    return cachedUrl;
  

  let existingUrl: Url | null;
  if (customUrl) existingUrl = await UrlRepository.GetByIdentifier(customUrl);
  else existingUrl = await UrlRepository.GetByIdentifier(url);

  if (existingUrl) 
    return existingUrl.shortUrl;
  else {
    let newUrl: any = {
      trueUrl: url,
      accessNumber: 1,
      extendedTTL: true,
    };

    if (customUrl) {
      newUrl["shortUrl"] = customUrl;
      const savedUrl = await UrlRepository.Add(newUrl);
      await UserRepository.UpdateCustomUrls(userId, savedUrl);
    } else {
      const shortUrl: string = UrlConversionService.ShortUrl(url);
      newUrl["shortUrl"] = shortUrl;
      await UrlRepository.Add(newUrl);
    }

    return newUrl.shortUrl;
  }
}
