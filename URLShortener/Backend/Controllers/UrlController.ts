import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { Router, Request, Response } from "express";
import { IController } from "./IController";
import { Url } from "../Models/Url.model";
import { IUrlConversionService } from "../Services/UrlServices/IUrlConversionService";
import { IUrlRepository } from "../Repositories/UrlRepositories/IUrlRepository";
import { HttpCodes } from "../Utils/HttpCodes.enum";
import { ITokenService } from "../Services/JWTokenServices/ITokenService";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";
import { ICacheRetrieveService } from "../Services/CacheRetrieveServices/ICacheRetrieveService";
import { GetUrlHandler } from "../Handlers/UrlHandlers/GetUrlByAnonymous";
import { GetUrlByUserHandler } from "../Handlers/UrlHandlers/GetUrlByUser";
import { NotFoundError } from "../Utils/CustomErrors/NotFound.error";
import { CreateUrlHandler } from "../Handlers/UrlHandlers/CreateUrlByAnonymous";
import { CreateUrlByUserHandler } from "../Handlers/UrlHandlers/CreateUrlByUser";

export class UrlController extends HttpStatusResponse implements IController {
  public Path: string = "";
  public Router: Router;
  private UserRepository: IUserRepository;
  private UrlRepository: IUrlRepository;
  private UrlConvService: IUrlConversionService;
  private TokenService: ITokenService;
  private CacheService: ICacheRetrieveService;

  constructor(
    UrlRepository: IUrlRepository,
    UserRepository: IUserRepository,
    UrlConversionService: IUrlConversionService,
    TokenService: ITokenService,
    CacheService: ICacheRetrieveService
  ) {
    super();
    this.Router = Router();
    this.UrlRepository = UrlRepository;
    this.UserRepository = UserRepository;
    this.UrlConvService = UrlConversionService;
    this.TokenService = TokenService;
    this.CacheService = CacheService;
    this.InitialzeRoutes();
  }

  private InitialzeRoutes(): void {
    this.Router.get(`${this.Path}/:url`, this.GetUrl.bind(this));
    this.Router.get(
      `${this.Path}/u/:id/:url`,
      [this.TokenService.Verify.bind(this)],
      this.GetUrlByUser.bind(this)
    );

    this.Router.post(`${this.Path}`, this.CreateUrl.bind(this));
    this.Router.post(
      `${this.Path}/u/:id`,
      this.TokenService.Verify.bind(this),
      this.CreateUrlByUser.bind(this)
    );

    this.Router.delete(
      `${this.Path}/u/d/:url`,
      this.TokenService.Verify.bind(this),
      this.DeleteCustomUrl.bind(this)
    );
  }

  private async GetUrl(request: Request, response: Response): Promise<void> {
    const reqUrl = request.params.url;

    try {
      const url: string | null = await GetUrlHandler(
        reqUrl,
        this.UrlRepository,
        this.CacheService
      );
      response.status(HttpCodes.Ok).json({ data: { url: url } });
      await this.UrlRepository.UpdateTTL(url);
    } catch (error) {
      if (error instanceof NotFoundError)
        response
          .status(HttpCodes.NotFound)
          .json(this.Error_NotFound("Could not find this url"));
      else
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
    }
    /*let cachedUrl = await this.CacheService.QueryCacheForUrl(reqUrl);
    if (cachedUrl) {
      response.status(HttpCodes.Ok).json({ data: { url: cachedUrl } });
      await this.UrlRepository.UpdateTTL(reqUrl);
    } else {
      try {
        const url: Url | null = await this.UrlRepository.GetByIdentifier(
          reqUrl
        );

        if (url) {
          response.status(HttpCodes.Ok).json({ data: { url: url.trueUrl } });
          await this.UrlRepository.UpdateTTL(reqUrl);
          this.CacheService.AddUrlToCache(url.shortUrl, url.trueUrl);
        } else {
          response
            .status(HttpCodes.NotFound)
            .json(this.Error_NotFound("Could not find this url"));
        }
      } catch (error) {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      }
    }*/
  }

  private async GetUrlByUser(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = request.params.id;
    const reqUrl = request.params.url;

    try {
      const url: string | null = await GetUrlByUserHandler(
        userId,
        reqUrl,
        this.UrlRepository,
        this.UserRepository,
        this.CacheService
      );
      response.status(HttpCodes.Ok).json({ data: { url: url } });
      await this.UrlRepository.UpdateTTL(url);
      await this.UserRepository.UpdateHistory(userId, url);
    } catch (error) {
      if (error instanceof NotFoundError)
        response
          .status(HttpCodes.NotFound)
          .json(this.Error_NotFound("Could not find this url"));
      else
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
    }
    /*let cachedUrl = await this.CacheService.QueryCacheForUrl(reqUrl);
    if (cachedUrl) {
      response.status(HttpCodes.Ok).json({ data: { url: cachedUrl } });
      await this.UrlRepository.UpdateTTL(reqUrl);
      await this.UserRepository.UpdateHistory(userId, cachedUrl);
    }

    try {
      const url = await this.UrlRepository.GetByIdentifier(reqUrl);

      if (url) {
        response.status(HttpCodes.Ok).json({ data: { url: url.trueUrl } });
        await this.UrlRepository.UpdateTTL(reqUrl);
        await this.UserRepository.UpdateHistory(userId, url.trueUrl);
      } else {
        response
          .status(HttpCodes.NotFound)
          .json(this.Error_NotFound("Could not find this url"));
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }*/
  }

  private async CreateUrl(request: Request, response: Response): Promise<void> {
    const reqUrl = request.body.data.url;

    try {
      const url: string = await CreateUrlHandler(
        reqUrl,
        this.UrlRepository,
        this.UrlConvService,
        this.CacheService
      );
      response.status(HttpCodes.Created).json({ data: { url: url } });
      await this.UrlRepository.UpdateTTL(url);
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }
    /*
    try {
      const existingUrl = await this.UrlRepository.GetByIdentifier(reqUrl);
      if (existingUrl) {
        const resUrl = existingUrl.shortUrl;
        response.status(HttpCodes.Ok).json({ data: { url: resUrl } });
      } else {
        const shortUrl: string = this.UrlConvService.ShortUrl(reqUrl);
        const newUrl: any = {
          trueUrl: reqUrl,
          shortUrl: shortUrl,
          accessNumber: 1,
        };
        await this.UrlRepository.Add(newUrl);
        response.status(HttpCodes.Created).json({ data: { url: shortUrl } });
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }*/
  }
  private async CreateUrlByUser(
    request: Request,
    response: Response
  ): Promise<void> {
    const reqUrl = request.body.data.url;
    const userId = request.params.id;
    const customUrl = request.body.custom;

    try {
      const url = await CreateUrlByUserHandler(
        userId,
        reqUrl,
        this.UrlRepository,
        this.UserRepository,
        this.UrlConvService,
        this.CacheService,
        customUrl
      );
      response.status(HttpCodes.Created).json({ data: { url: url } });
      await this.UserRepository.UpdateHistory(userId, url);
      await this.UrlRepository.UpdateTTL(url);
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }
    /*
    try {
      let existingUrl: Url | null;
      if (customUrl)
        existingUrl = await this.UrlRepository.GetByIdentifier(customUrl);
      else existingUrl = await this.UrlRepository.GetByIdentifier(reqUrl);
      if (existingUrl) {
        const resUrl = existingUrl.shortUrl;
        await this.UserRepository.UpdateHistory(userId, existingUrl.trueUrl);
        response.status(HttpCodes.Ok).json({ data: { url: resUrl } });
      } else {
        let newUrl: any = {
          trueUrl: reqUrl,
          accessNumber: 1,
          extendedTTL: true,
        };
        if (customUrl) {
          newUrl["shortUrl"] = customUrl;
          const savedUrl = await this.UrlRepository.Add(newUrl);
          await this.UserRepository.UpdateCustomUrls(userId, savedUrl);
        } else {
          const shortUrl: string = this.UrlConvService.ShortUrl(reqUrl);
          newUrl["shortUrl"] = shortUrl;
          await this.UrlRepository.Add(newUrl);
        }

        await this.UserRepository.UpdateHistory(userId, reqUrl);

        response
          .status(HttpCodes.Created)
          .json({ data: { url: newUrl.shortUrl } });
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }*/
  }

  private async DeleteCustomUrl(
    request: Request,
    response: Response
  ): Promise<void> {
    const url = request.params.url;

    this.UrlRepository.DeleteByIdentifier(url)
      .then(() => {
        response.status(HttpCodes.NoContent);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      });
  }
}
