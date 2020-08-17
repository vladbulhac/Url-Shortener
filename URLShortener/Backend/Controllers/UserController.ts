import { Router } from "express";
import {Router,Response,Request} from 'express';
import { ICrudRepository } from "../Repositories/ICrudRepository";
import { IUserRepository } from "../Repositories/IUserRepository";
import { HttpStatusResponse } from "../Utils/HttpStatusResponse";

export class UserContorller extends HttpStatusResponse implements IController{
    public Path:string;
    public Router:Router;
    private UserRepository:IUserRepository;

    constructor()
    {
        super();
        this.Router=Router();
    }



}