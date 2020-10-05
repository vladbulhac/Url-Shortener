import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";

export async function GetUrlHandler(
  url: string,
  UrlRepository: IUrlRepository,
  CacheService: ICacheService
): Promise<Url> {
  let cachedUrl = await CacheService.QueryCache(url);
  if (cachedUrl) {
    const urlObj:Url=JSON.parse(cachedUrl);
    return urlObj;
  }


  const urlData: Url | null = await UrlRepository.GetByIdentifier(url);
  if (urlData && urlData.isActive===true) {
    CacheService.Add(url, JSON.stringify(urlData));
    return urlData;
  } else {
    throw new NotFoundError("Could not find this url");
  }
}
