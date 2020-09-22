import { Router, Response, Request, NextFunction } from "express";
import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { IController } from "./IController";
import { LoginService } from "../Services/UserServices/LoginService";
import { HttpCodes } from "../Utils/HttpCodes.enum";
import { RegisterService } from "../Services/UserServices/RegisterService";
import { TokenService } from "../Services/JWTokenServices/TokenService";
import { User } from "../Models/User.model";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "../Services/JWTokenServices/ITokenService";

export class UserController extends HttpStatusResponse implements IController {
  public Path: string = "/users";
  public Router: Router;
  private UserRepository: IUserRepository;
  private TokenService: ITokenService;
  private LoginService:LoginService;
  private RegisterService:RegisterService;

  constructor(userRepo: IUserRepository, tokenService: ITokenService,loginService:LoginService,registerService:RegisterService) {
    super();
    this.UserRepository = userRepo;
    this.TokenService = tokenService;
    this.LoginService=loginService;
    this.RegisterService=registerService;
    this.Router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes(): void {
    this.Router.get(`${this.Path}/login`, this.Login.bind(this));
    this.Router.get(`${this.Path}/:id`, this.GetUserById.bind(this));

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
    
    this.LoginService
      .Login(requestBody.email, requestBody.password)
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
          .json(this.Error_BadRequest(String(error)));
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
          .json(this.Error_BadRequest(String(error)));
      });
  }

  private Register(request: Request, response: Response): void {
    const requestBody = request.body.data;
  
    this.RegisterService
      .Register(requestBody)
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
          .json(this.Error_BadRequest(String(error)));
      });
  }

  private UpdateUser(request: Request, response: Response): void {
    const requestBody: User = request.body.data;
    const requestId: string = request.params.id;

    this.UserRepository.Update(requestId, requestBody)
      .then((updatedData) => {
        if (updatedData)
          response.status(HttpCodes.Ok).json({ data: { updatedData } });
        else response.status(HttpCodes.NotFound).json(this.Error_NotFound);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      });
  }

  private DeleteUserById(request: Request, response: Response): void {
    const requestId: string = request.params.id;

    this.UserRepository.DeleteByIdentifier(requestId)
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
