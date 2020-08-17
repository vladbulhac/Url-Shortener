import { Router } from "express";
import {Router,Response,Request} from 'express';
import { ICrudRepository } from "../Repositories/ICrudRepository";
import { IUserRepository } from "../Repositories/IUserRepository";

export class UserContorller extends implements IController{
    public Path:string;
    public Router:Router;
    private UserRepository:IUserRepository;

    constructor()
    {
        this.Router=Router();
    }



}