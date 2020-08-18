import {Request,Response,NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpCodes } from '../../Utils/HttpCodes.enum';
import { HttpStatusResponse } from '../../Utils/HttpStatusResponse';
require('dotenv').config();

export class VerifyTokenService extends HttpStatusResponse{
    constructor(){
        super();
    }
    public VerifyToken(Request:Request,Response:Response,Next:NextFunction):void{
        let HeaderData:string|undefined=Request.headers['authorization'];
        if(HeaderData)
        {
            let HeaderSplit:string[]=HeaderData.split(' ');
            let TokenData:string=HeaderSplit[1];
            const JWT_SECRET=process.env.JWT_SECRET!;
            jwt.verify(TokenData,JWT_SECRET,(err,decoded)=>{
                    if(err)
                        {Response.status(HttpCodes.Unauthorized)
                                                .json(this.Error_Unauthorized(JSON.stringify(err)));
                        return;
                        }
                    else
                    if(decoded)
                        Next();
            });
        }
        else
            Response.status(HttpCodes.Unauthorized)
                                    .json(this.Error_Unauthorized("Token has not been provided"));
            return;
    }
}