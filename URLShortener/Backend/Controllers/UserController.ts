import { Router, Response, Request } from "express";
import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { IController } from "./IController";
import { LoginService } from "../Services/UserServices/LoginService";
import { HttpCodes } from "../Utils/HttpCodes.enum";
import { UserRepository } from "../Repositories/UserRepositories/UserRepository";
import { RegisterService } from "../Services/UserServices/RegisterService";
import { VerifyTokenService } from "../Services/JWTokenServices/VerifyTokenService";
import { User } from "../Models/User.model";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";

export class UserController extends HttpStatusResponse implements IController {
  public Path: string = "/users";
  public Router: Router;
  private UserRepository:IUserRepository;

  constructor(UserRepo:IUserRepository) {
    super();
    this.UserRepository=UserRepo;
    this.Router = Router();
    this.InitializeRoutes();
  }

  private InitializeRoutes(): void {
    this.Router.get(`${this.Path}/login`, this.Login.bind(this))
    this.Router.get(`${this.Path}`, this.GetAll.bind(this));
    this.Router.get(`${this.Path}/:id`, this.GetUserById.bind(this));

    this.Router.post(`${this.Path}/register`, this.Register.bind(this));

    this.Router.put(
      `${this.Path}/:id`,
      [new VerifyTokenService().VerifyToken],
      this.UpdateUser.bind(this)
    );

    this.Router.delete(
      `${this.Path}/:id`,
      [new VerifyTokenService().VerifyToken],
      this.DeleteUserById.bind(this)
    );
    this.Router.delete(
      `${this.Path}`,
      [new VerifyTokenService().VerifyToken],
      this.DeleteAll.bind(this)
    );
  }

  private Login(Request: Request, Response: Response): void {
    const RequestBody = Request.body.Data;
    let LoginHelper: LoginService = new LoginService(this.UserRepository);

    LoginHelper.Login(RequestBody.Email, RequestBody.Password)
      .then((LoginData) => {
        if (LoginData.Message === "Successful")
          Response.status(HttpCodes.Ok).json({ Data: { LoginData } });
        else
          Response.status(HttpCodes.NotFound).json(
            this.Error_NotFound("Email or Password Incorrect")
          );
      })
      .catch((Error) => {
        Response.status(HttpCodes.BadRequest).json(
          this.Error_BadRequest(Error)
        );
      });
  }

  private GetAll(Request: Request, Response: Response): void {
    this.UserRepository
      .GetAll()
      .then((Users) => {
        if (Users.length === 0)
          Response.status(HttpCodes.NoContent).json({ Data: { Users } });
        else Response.status(HttpCodes.Ok).json({ Data: { Users } });
      })
      .catch((Error) => {
        Response.status(HttpCodes.BadRequest).json(
          this.Error_BadRequest(Error)
        );
      });
  }

  private GetUserById(Request: Request, Response: Response): void {
    const Id = Request.params.id;
    this.UserRepository
      .GetById(Id)
      .then((User) => {
        if (User) Response.status(HttpCodes.Ok).json({ Data: { User } });
        else Response.status(HttpCodes.NotFound).json(this.Error_NotFound);
      })
      .catch((Error) => {
        Response.status(HttpCodes.BadRequest).json(
          this.Error_BadRequest(Error)
        );
      });
  }

  private Register(Request: Request, Response: Response): void {
    const RequestBody = Request.body.Data;
    let RegisterHelper: RegisterService = new RegisterService(this.UserRepository);

    RegisterHelper.Register(RequestBody)
      .then((RegisterData) => {
        if (RegisterData.Message === "Successful")
          Response.status(HttpCodes.Ok).json({ Data: { RegisterData } });
        else Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest);
      })
      .catch((Error) => {
        Response.status(HttpCodes.BadRequest).json(
          this.Error_BadRequest(Error)
        );
      });
  }

  private UpdateUser(Request: Request, Response: Response): void {
      const RequestBody:User=Request.body.Data;
      const RequestId:string=Request.params.id;

      this.UserRepository.Update(RequestId,RequestBody)
            .then(UpdatedData=>{
                if(UpdatedData) Response.status(HttpCodes.Ok)
                                                                    .json({Data:{UpdatedData}});
                else
                    Response.status(HttpCodes.NotFound).json(this.Error_NotFound);
            })
            .catch(Error=>{
                Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
            });
  }

  private DeleteUserById(Request: Request, Response: Response): void {
      const RequestId:string=Request.params.id;

      this.UserRepository.DeleteById(RequestId)
                .then(()=>{
                    Response.status(HttpCodes.NoContent);
                })
                .catch(Error=>{
                    Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
                });
  }

  private DeleteAll(Request: Request, Response: Response): void {
      this.UserRepository.Delete()
            .then(()=>{
                Response.status(HttpCodes.NoContent);
            })
            .catch(Error=>{
                Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
            });
  }
}
