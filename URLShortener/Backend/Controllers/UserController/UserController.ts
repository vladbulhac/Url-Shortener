import { Request, Response, Router } from "express";
import { Inject } from "typescript-ioc";
import { User } from "../../Models/User.model";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { ITokenService } from "../../Services/JWTokenServices/ITokenService";
import { IUserServices } from "../../Services/UserServices/IUserServices";
import { HttpCodes } from "../../Utils/HttpCodes.enum";
import { UserControllerBase } from "./UserControllerBase";

export class UserController
  extends UserControllerBase {
  public Path: string = "/v1/users";
  public Router: Router;

  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private TokenService!: ITokenService;
  @Inject
  private CacheService!: ICacheService;
  @Inject
  private UserServices!:IUserServices;

  constructor() {
    super();

    this.Router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes(): void {
    this.Router.get(`${this.Path}/:id`, this.GetUserById.bind(this));

    this.Router.post(`${this.Path}/login`, this.Login.bind(this));
    this.Router.post(`${this.Path}/register`, this.Register.bind(this));

    this.Router.put(
      `${this.Path}/:id`,
      [this.TokenService.Verify.bind(this)],
      this.UpdateUser.bind(this)
    );

    this.Router.delete(
      `${this.Path}/:id`,
      [this.TokenService.Verify.bind(this)],
      this.DeleteUserById.bind(this)
    );
  }

  private Login(request: Request, response: Response): void {
    const requestBody = request.body.data;

    this.UserServices.Login(requestBody.email, requestBody.password)
      .then((loginData) => {
        if (loginData.message === "Successful")
          response.status(HttpCodes.Ok).json({ data: { loginData } });
        else
          response
            .status(HttpCodes.NotFound)
            .json(this.Error_NotFound("Email or Password is incorrect"));
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(error.message));
      });
  }

  private GetUserById(request: Request, response: Response): void {
    const id = request.params.id;

    this.UserRepository.GetByIdentifier(id)
      .then((user) => {
        if (user) response.status(HttpCodes.Ok).json({ data: { user } });
        else response.status(HttpCodes.NotFound).json(this.Error_NotFound);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(error.message));
      });
  }

  private Register(request: Request, response: Response): void {
    const requestBody = request.body.data;

    this.UserServices.Register(requestBody)
      .then((registerData) => {
        if (registerData.message === "Successful")
          response.status(HttpCodes.Created).json({ data: { registerData } });
        else if (registerData.message === "Conflict")
          response
            .status(HttpCodes.Conflict)
            .json(this.Error_Conflict("Email is already used by another user"));
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(error.message));
      });
  }

  private UpdateUser(request: Request, response: Response): void {
    const requestBody: User = request.body.data;
    const requestId: string = request.params.id;

    this.UserServices.UpdateCredentials(
      requestId,
      requestBody.email,
      requestBody.password
    )
      .then((updatedData) => {
        if (updatedData) {
          response.status(HttpCodes.Ok).json({ data: { updatedData } });
          this.CacheService.Add(updatedData.email, JSON.stringify(updatedData));
        } else response.status(HttpCodes.NotFound).json(this.Error_NotFound);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(error.message));
      });
  }

  private DeleteUserById(request: Request, response: Response): void {
    const requestId: string = request.params.id;

    this.UserRepository.DeleteByIdentifier(requestId)
      .then((data: User) => {
        response.status(HttpCodes.NoContent);
        this.CacheService.Delete(data.email);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(error.message));
      });
  }
}
