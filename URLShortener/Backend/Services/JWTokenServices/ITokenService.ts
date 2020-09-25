import { NextFunction } from "express";

export abstract class ITokenService{
     abstract Create(id:string):string;
     abstract Verify(request:Express.Request,response:Express.Response,next:NextFunction):void;
}