import {Router,Response,Request} from 'express';
import { ICrudRepository } from "../Repositories/ICrudRepository";
import { IUserRepository } from "../Repositories/UserRepositories/IUserRepository";
import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { IController } from "./IController";

export class UserController extends HttpStatusResponse implements IController{
    public Path:string='/users';
    public Router:Router;

    constructor()
    {
        super();
        this.Router=Router();
    }



}