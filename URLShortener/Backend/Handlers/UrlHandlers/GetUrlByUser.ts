import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../Services/CacheRetrieveServices/ICacheService";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";

export async function GetUrlByUserHandler(
  url: string,
  UrlRepository: IUrlRepository,
  CacheService: ICacheService
): Promise<string> {
  try{
  let cachedUrl = await CacheService.QueryCacheForUrl(url);
  if (cachedUrl) return cachedUrl;
  }catch(error)
  {console.log(error);}

  const urlData: Url | null = await UrlRepository.GetByIdentifier(url);

  if (urlData) return urlData.trueUrl;
  else throw new NotFoundError("Could not find this url");
}
