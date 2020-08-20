import {Request,Response,NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpCodes } from '../../Utils/HttpCodes.enum';
import { HttpStatusResponse } from '../../Utils/HttpStatusResponse';
require('dotenv').config();

export class VerifyTokenService extends HttpStatusResponse{
    constructor(){
        super();
    }
    public VerifyToken(request:Request,response:Response,Next:NextFunction):void{
        let headerData:string|undefined=request.headers['authorization'];
        if(headerData)
        {
            let headerSplit:string[]=headerData.split(' ');
            let tokenData:string=headerSplit[1];
            const JWT_SECRET=process.env.JWT_SECRET!;
            jwt.verify(tokenData,JWT_SECRET,(error,decoded)=>{
                    if(error)
                        {response.status(HttpCodes.Unauthorized)
                                                .json(this.Error_Unauthorized(JSON.stringify(error)));
                        return;
                        }
                    else
                    if(decoded)
                        Next();
            });
        }
        else
            response.status(HttpCodes.Unauthorized)
                                    .json(this.Error_Unauthorized("Token has not been provided"));
            return;
    }
}