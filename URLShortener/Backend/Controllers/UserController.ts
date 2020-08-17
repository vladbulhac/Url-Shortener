import {Router,Response,Request} from 'express';
import { ICrudRepository } from "../Repositories/ICrudRepository";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";
import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { IController } from "./IController";
import {LoginService} from '../Services/UserServices/LoginService';
import { HttpCodes } from '../Utils/HttpCodes.enum';
import { UserRepository } from '../Repositories/UserRepositories/UserRepository';
import { RegisterService } from '../Services/UserServices/RegisterService';

export class UserController extends HttpStatusResponse implements IController{
    public Path:string='/users';
    public Router:Router;

    constructor()
    {
        super();
        this.Router=Router();
        this.InitializeRoutes();
    }

    private InitializeRoutes():void{
        this.Router.get(`${this.Path}/login`,this.Login.bind(this));
        this.Router.get(`${this.Path}`,this.GetAll.bind(this));
        this.Router.get(`${this.Path}/:id`,this.GetUserById.bind(this));

        this.Router.post(`${this.Path}/register`,this.Register.bind(this));

        this.Router.put(`${this.Path}/:id`,[VerifyToken],this.UpdateUser.bind(this));
        
        this.Router.delete(`${this.Path}/:id`,[VerifyToken],this.DeleteUserById.bind(this));
        this.Router.delete(`${this.Path}`,[VerifyToken],this.DeleteAll.bind(this));
    }

    private Login(Request:Request,Response:Response):void{
            const RequestBody=Request.body.Data;
            let LoginHelper:LoginService=new LoginService();

            LoginHelper.Login(RequestBody.Email,RequestBody.Password)
                .then(LoginData=>{
                    if(LoginData.Message==="Successful") Response.status(HttpCodes.Ok).json({Data:{LoginData}});
                    else
                        Response.status(HttpCodes.NotFound).json(this.Error_NotFound("Email or Password Incorrect"));
                })
                .catch(Error=>{
                    Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
                });
    }


    private GetAll(Request:Request,Response:Response):void{
        UserRepository.GetInstance().GetAll()
            .then(Users=>{
                if(Users.length===0)
                    Response.status(HttpCodes.NoContent).json({Data:{Users}});
                else
                    Response.status(HttpCodes.Ok).json({Data:{Users}});
            })
            .catch(Error=>{
                Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
            });
    }

    private GetUserById(Request:Request,Response:Response):void{
        const Id=Request.params.id;
        UserRepository.GetInstance().GetById(Id)
            .then(User=>{
                if(User) Response.status(HttpCodes.Ok).json({Data:{User}});
                else
                Response.status(HttpCodes.NotFound).json(this.Error_NotFound);
            })
            .catch(Error=>{
                Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
            });
    }

    private Register(Request:Request,Response:Response):void{
        const RequestBody=Request.body.Data;
        let RegisterHelper:RegisterService=new RegisterService();

        RegisterHelper.Register(RequestBody)
            .then(RegisterData=>{
                if(RegisterData.Message==="Successful") Response.status(HttpCodes.Ok).json({Data:{RegisterData}});
                else
                    Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest);
            })
            .catch(Error=>{
                Response.status(HttpCodes.BadRequest).json(this.Error_BadRequest(Error));
            });
    }





}