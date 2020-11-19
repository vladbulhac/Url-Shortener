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

  public async CreateUrlByUser(
    userId: string,
    url: string,
    customUrl: string | undefined | null
  ): Promise<string> {
    let existingUrl: Url | null;
    if (customUrl)
      existingUrl = await this.UrlRepository.GetByIdentifier(customUrl);
    else existingUrl = await this.UrlRepository.GetByIdentifier(url);

    if (existingUrl) {
      if (existingUrl.isActive === true && customUrl)
        throw new ConflictError("This url already exists");
      else if (existingUrl.isActive === false) {
        await this.UrlRepository.SetActive(String(existingUrl._id));
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
      savedUrl = await this.UrlRepository.Add(newUrl);
      await this.UserRepository.UpdateCustomUrls(userId, savedUrl);
    } else {
      const shortUrl: string = this.UrlConversionService.ShortUrl(url);
      newUrl["shortUrl"] = shortUrl;
      savedUrl = await this.UrlRepository.Add(newUrl);
    }
    this.CacheService.Add(savedUrl.shortUrl, JSON.stringify(savedUrl));

    return newUrl.shortUrl;
  }

  public async CreateUrl(url: string): Promise<string> {
    const existingUrl: Url | null = await this.UrlRepository.GetByIdentifier(
      url
    );
    if (existingUrl) {
      if (existingUrl.isActive === false)
        await this.UrlRepository.SetActive(String(existingUrl._id));
      return existingUrl.shortUrl;
    }

    const shortUrl: string = this.UrlConversionService.ShortUrl(url);
    const newUrl: any = {
      trueUrl: url,
      shortUrl: shortUrl,
      accessNumber: 1,
    };
    const savedUrl: Url = await this.UrlRepository.Add(newUrl);
    this.CacheService.Add(savedUrl.shortUrl, JSON.stringify(savedUrl));

    return shortUrl;
  }

  public async GetUrlByUser(url: string): Promise<string> {
    let cachedUrl = await this.CacheService.QueryCache(url);
    if (cachedUrl) {
      const urlObj: Url = JSON.parse(cachedUrl);
      return urlObj.trueUrl;
    }

    const urlData: Url | null = await this.UrlRepository.GetByIdentifier(url);

    if (urlData && urlData.isActive === true) {
      this.CacheService.Add(url, JSON.stringify(urlData));
      return urlData.trueUrl;
    } else throw new NotFoundError("Could not find this url");
  }

  public async GetUrl(url: string): Promise<Url> {
    let cachedUrl = await this.CacheService.QueryCache(url);
    if (cachedUrl) {
      const urlObj: Url = JSON.parse(cachedUrl);
      return urlObj;
    }

    const urlData: Url | null = await this.UrlRepository.GetByIdentifier(url);
    if (urlData && urlData.isActive === true) {
      this.CacheService.Add(url, JSON.stringify(urlData));
      return urlData;
    } else {
      throw new NotFoundError("Could not find this url");
    }
  }
}
