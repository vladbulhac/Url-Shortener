import { Inject } from "typescript-ioc";
import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ConflictError } from "../../Utils/CustomErrors/Conflict.error";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";
import { ICacheService } from "../CacheServices/ICacheService";
import { IUrlServices } from "./IUrlServices";
import { IUrlConversionService } from "./UrlConversionService/IUrlConversionService";

export class UrlServices extends IUrlServices {
  @Inject
  private UrlRepository!: IUrlRepository;
  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private CacheService!: ICacheService;
  @Inject
  private UrlConversionService!: IUrlConversionService;

  public async CreateUrl(
    url: string,
    userId?: string | undefined | null,
    customUrl?: string | undefined | null
  ): Promise<string> {
    let createdUrl: Url;
    if (customUrl && userId)
      createdUrl = await this.AddToDatabaseCacheAndUser_UrlWithCustomName(
        userId!,
        url,
        customUrl!,
        true
      );
    else if (userId)
      createdUrl = await this.ConvertAndAddUrlToDatabaseCache_OrReturnExistingOne(
        url,
        true
      );
    else
      createdUrl = await this.ConvertAndAddUrlToDatabaseCache_OrReturnExistingOne(
        url,
        false
      );

    return createdUrl.shortUrl;
  }

  public async GetUrl(url: string): Promise<string> {
    let cachedUrl = await this.CacheService.QueryCache(url);
    if (cachedUrl) {
      const urlObj: Url = JSON.parse(cachedUrl);
      return urlObj.trueUrl;
    }

    const urlData: Url | null = await this.UrlRepository.GetByIdentifier(url);
    if (urlData && urlData.isActive === true) {
      this.CacheService.Add(url, JSON.stringify(urlData));
      return urlData.trueUrl;
    } else {
      throw new NotFoundError("Could not find this url");
    }
  }

  private async AddToDatabaseCacheAndUser_UrlWithCustomName(
    userId: string,
    url: string,
    customUrl: string,
    extendedTTL: boolean
  ) {
    let existingUrl: Url | null = await this.UrlRepository.GetByIdentifier(
      customUrl
    );
    if (existingUrl !== null && existingUrl.isActive === true)
      throw new ConflictError("This url already exists");

    const savedUrl: Url = await this.AddUrlToDatabaseAndCache(
      customUrl,
      url,
      extendedTTL
    );
    await this.UserRepository.UpdateCustomUrls(userId, savedUrl);

    return savedUrl;
  }

  private async ConvertAndAddUrlToDatabaseCache_OrReturnExistingOne(
    url: string,
    extendedTTL: boolean
  ) {
    let existingUrl: Url | null = await this.UrlRepository.GetByIdentifier(url);
    if (existingUrl) {
      if (existingUrl.isActive === false)
        await this.UrlRepository.SetActive(String(existingUrl._id));
      return existingUrl;
    }

    const shortUrl: string = this.UrlConversionService.ShortUrl(url);
    return await this.AddUrlToDatabaseAndCache(shortUrl, url, extendedTTL);
  }

  private async AddUrlToDatabaseAndCache(
    shortUrl: string,
    url: string,
    extendedTTL: boolean
  ): Promise<Url> {
    let newUrl: any = {
      trueUrl: url,
      accessNumber: 1,
      extendedTTL: extendedTTL,
    };

    newUrl["shortUrl"] = shortUrl;
    let savedUrl: Url = await this.UrlRepository.Add(newUrl);

    this.CacheService.Add(savedUrl.shortUrl, JSON.stringify(savedUrl));

    return savedUrl;
  }
}
