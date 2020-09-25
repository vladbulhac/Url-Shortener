
import { Request, Response, Router } from "express";
import { Inject } from "typescript-ioc";
import { CreateUrlByUserHandler } from "../../Handlers/UrlHandlers/CreateUrlByUserHandler";
import { CreateUrlHandler } from "../../Handlers/UrlHandlers/CreateUrlHandler";
import { GetUrlByUserHandler } from "../../Handlers/UrlHandlers/GetUrlByUserHandler";
import { GetUrlHandler } from "../../Handlers/UrlHandlers/GetUrlHandler";
import { Url } from "../../Models/Url.model";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { ITokenService } from "../../Services/JWTokenServices/ITokenService";
import { IUrlConversionService } from "../../Services/UrlServices/IUrlConversionService";
import { ConflictError } from "../../Utils/CustomErrors/Conflict.error";
import { NotFoundError } from "../../Utils/CustomErrors/NotFound.error";
import { HttpCodes } from "../../Utils/HttpCodes.enum";
import { HttpStatusResponse } from "../../Utils/HttpStatusResponse";
import { IUrlController } from "./IUrlController";

export class UrlController extends HttpStatusResponse implements IUrlController {
  public Path: string = "";
  public Router: Router;

  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private UrlRepository!: IUrlRepository;
  @Inject
  private UrlConvService!: IUrlConversionService;
  @Inject
  private TokenService!: ITokenService;
  @Inject
  private CacheService!: ICacheService;

  constructor(
  ) {
    super();
    this.Router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes(): void {
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
      const url: Url | null = await GetUrlHandler(
        reqUrl,
        this.UrlRepository,
        this.CacheService
      );
      
      response.status(HttpCodes.Ok).json({ data: { url: url.trueUrl } });
      await this.UrlRepository.UpdateTTL(url.shortUrl);
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
  }

  private async GetUrlByUser(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = request.params.id;
    const reqUrl = request.params.url;

    try {
      const url: string | null = await GetUrlByUserHandler(
        reqUrl,
        this.UrlRepository,
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
      if(error instanceof ConflictError)
      response
      .status(HttpCodes.Conflict)
      .json(this.Error_Conflict("This short url has already been used"));
      else
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
    }
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
  }
  private async CreateUrlByUser(
    request: Request,
    response: Response
  ): Promise<void> {
    const reqUrl = request.body.data.url;
    const userId = request.params.id;
    const customUrl = request.body.data.custom;

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
