import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";

export async function GetUrlByUserHandler(
  url: string,
  UrlRepository: IUrlRepository,
  CacheService: ICacheService
): Promise<string> {

  let cachedUrl = await CacheService.QueryCache(url);
  if (cachedUrl) {
    const urlObj:Url=JSON.parse(cachedUrl);
    return urlObj.trueUrl;
  }

  const urlData: Url | null = await UrlRepository.GetByIdentifier(url);

  if (urlData) {
    CacheService.Add(url, JSON.stringify(urlData));
    return urlData.trueUrl;}
  else throw new NotFoundError("Could not find this url");
}
