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

export class UrlController extends HttpStatusResponse implements IController {
  public Path: string = "/";
  public Router: Router;
  private UrlRepository: IUrlRepository;
  private UrlConvService: IUrlConversionService;
  private TokenService: ITokenService;

  constructor(
    UrlRepository: IUrlRepository,
    UrlConversionService: IUrlConversionService,
    TokenService: ITokenService
  ) {
    super();
    this.Router = Router();
    this.UrlRepository = UrlRepository;
    this.UrlConvService = UrlConversionService;
    this.TokenService = TokenService;
    this.InitialzeRoutes();
  }

  private InitialzeRoutes(): void {
    this.Router.get(`${this.Path}/:url`, this.GetUrl.bind(this));

    this.Router.post(`${this.Path}`, this.CreateUrl.bind(this));
    this.Router.post(
      `${this.Path}`,
      this.TokenService.Verify.bind(this),
      this.CreateUrl.bind(this)
    );
  }

  private GetUrl(request: Request, response: Response): void {
    const reqUrl = request.body.data;

    this.UrlRepository.FindByUrl(reqUrl)
      .then((url: Url | null) => {
        if (url) {
          const shortUrl: string = url.shortUrl;
          response.status(HttpCodes.Ok).json({ data: { shortUrl } });
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
        response.status(HttpCodes.Ok).json({ data: { resUrl } });
      }
      else
      {
          const newUrl=await this.UrlRepository.Add(reqUrl)
      }
    } catch (error) {
      response
        .status(HttpCodes.BadRequest)
        .json(this.Error_BadRequest(String(error)));
    }
  }
}
