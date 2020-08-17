import { HttpStatusResponse } from "../Utils/HttpStatusResponse";
import { Router } from "express";
import { IController } from "./IController";

export class UrlController extends HttpStatusResponse implements IController{
    public Path:string='/';
    public Router:Router;
    constructor()
    {
        super();
        this.Router=Router();
    }
}