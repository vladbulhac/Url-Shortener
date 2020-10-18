import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { IUrlConversionService } from "../../Services/UrlServices/IUrlConversionService";
import { ConflictError } from "../../Utils/CustomErrors/Conflict.error";

export async function CreateUrlByUserHandler(
  userId: string,
  url: string,
  UrlRepository: IUrlRepository,
  UserRepository: IUserRepository,
  UrlConversionService: IUrlConversionService,
  CacheService: ICacheService,
  customUrl: string | undefined | null
): Promise<string> {
  let existingUrl: Url | null;
  if (customUrl) existingUrl = await UrlRepository.GetByIdentifier(customUrl);
  else existingUrl = await UrlRepository.GetByIdentifier(url);

  if (existingUrl) {
    if (existingUrl.isActive === true && customUrl)
      throw new ConflictError("This url already exists");
    else if (existingUrl.isActive === false) {
      await UrlRepository.SetActive(String(existingUrl._id));
      return existingUrl.shortUrl;
    } else if (existingUrl.isActive === true) return existingUrl.shortUrl;
  }

  let newUrl: any = {
    trueUrl: url,
    accessNumber: 1,
    extendedTTL: true,
  };

  let savedUrl: Url;
  if (customUrl) {
    newUrl["shortUrl"] = customUrl;
    savedUrl = await UrlRepository.Add(newUrl);
    await UserRepository.UpdateCustomUrls(userId, savedUrl);
  } else {
    const shortUrl: string = UrlConversionService.ShortUrl(url);
    newUrl["shortUrl"] = shortUrl;
    savedUrl = await UrlRepository.Add(newUrl);
  }
  CacheService.Add(savedUrl.shortUrl, JSON.stringify(savedUrl));

  return newUrl.shortUrl;
}
