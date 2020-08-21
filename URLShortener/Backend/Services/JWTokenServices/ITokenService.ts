import { NextFunction } from "express";

export interface ITokenService{
    Create(id:string):string;
    Verify(request:Express.Request,response:Express.Response,next:NextFunction):void;
}