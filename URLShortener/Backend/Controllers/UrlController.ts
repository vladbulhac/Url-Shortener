import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { Router, Request, Response } from "express";
import { IController } from "./IController";
import { UrlConversionService } from "../Services/UrlServices/UrlConversionService";
import { ICrudRepository } from "../Repositories/ICrudRepository";
import { Url } from "../Models/Url.model";
import { IUrlConversionService } from "../Services/UrlServices/IUrlConversionService";
import { IUrlRepository } from "../Repositories/UrlRepositories/IUrlRepository";
import { HttpCodes } from "../Utils/HttpCodes.enum";
import { ITokenService } from "../Services/JWTokenServices/ITokenService";
import { url } from "envalid";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";

export class UrlController extends HttpStatusResponse implements IController {
  public Path: string = "";
  public Router: Router;
  private UserRepository: IUserRepository;
  private UrlRepository: IUrlRepository;
  private UrlConvService: IUrlConversionService;
  private TokenService: ITokenService;

  constructor(
    UrlRepository: IUrlRepository,
    UserRepository: IUserRepository,
    UrlConversionService: IUrlConversionService,
    TokenService: ITokenService
  ) {
    super();
    this.Router = Router();
    this.UrlRepository = UrlRepository;
    this.UserRepository = UserRepository;
    this.UrlConvService = UrlConversionService;
    this.TokenService = TokenService;
    this.InitialzeRoutes();
  }

  private InitialzeRoutes(): void {
    this.Router.get(`${this.Path}/:url`, this.GetUrl.bind(this));
    this.Router.get(
      `${this.Path}/users/:id/:url`,
      [this.TokenService.Verify.bind(this)],
      this.GetUrlByUser.bind(this)
    );

    this.Router.post(`${this.Path}`, this.CreateUrl.bind(this));
    this.Router.post(
      `${this.Path}/users/:id`,
      this.TokenService.Verify.bind(this),
      this.CreateUrlByUser.bind(this)
    );
  }

  private GetUrl(request: Request, response: Response): void {
    const reqUrl = request.params.data;

    this.UrlRepository.FindByUrl(reqUrl)
      .then((url: Url | null) => {
        if (url) {
          const shortUrl: string = url.shortUrl;
          response.status(HttpCodes.Ok).json({ data: { url:shortUrl } });
        } else
          response
            .status(HttpCodes.NotFound)
            .json(this.Error_NotFound("Could not find this url"));
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      });
  }

  private GetUrlByUser(request: Request, response: Response): void {
    const userId = request.params.id;
    const reqUrl = request.params.url;

    this.UrlRepository.FindByUrl(reqUrl)
      .then(async(url: Url | null) => {
        if (url) {
          const shortUrl: string = url.shortUrl;
         await  this.UserRepository.UpdateHistory(userId, url.trueUrl);
          response.status(HttpCodes.Ok).json({ data: { url:shortUrl } });
        } else
          response
            .status(HttpCodes.NotFound)
            .json(this.Error_NotFound("Could not find this url"));
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      });
  }

  private async CreateUrl(request: Request, response: Response): Promise<void> {
    const reqUrl = request.body.data;

    try {
      const existingUrl = await this.UrlRepository.FindByUrl(reqUrl);
      if (existingUrl) {
        const resUrl = existingUrl.shortUrl;
        response.status(HttpCodes.Ok).json({ data: { url:resUrl } });
      } else {
        const newUrl:Url = await this.UrlRepository.Add(reqUrl);
        response.status(HttpCodes.Ok).json({data:{url:newUrl.shortUrl}});
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }
  }
  private async CreateUrlByUser(request: Request, response: Response): Promise<void> {
    const reqUrl = request.body.data;
    const userId=request.params.id;

    try {
      const existingUrl = await this.UrlRepository.FindByUrl(reqUrl);
      if (existingUrl) {
        const resUrl = existingUrl.shortUrl;
        await this.UserRepository.UpdateHistory(userId,existingUrl.trueUrl);
        response.status(HttpCodes.Ok).json({ data: { url:resUrl } });
      } else {
        reqUrl["extendedLifeTime"]=true;
        const newUrl:Url = await this.UrlRepository.Add(reqUrl);
        response.status(HttpCodes.Ok).json({data:{url:newUrl.shortUrl}});
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }
  }
}


