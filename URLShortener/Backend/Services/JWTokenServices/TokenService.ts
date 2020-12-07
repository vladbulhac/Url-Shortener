import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { HttpCodes } from "../../Utils/HttpCodes.enum";
import { HttpStatusResponse } from "../../Utils/HttpStatusResponse";
import { ITokenService } from "./ITokenService";
 require("dotenv").config();

export class TokenService extends HttpStatusResponse implements ITokenService {

  constructor() {
    super();
  }

  public Create(userId: string): string {
    const secret:string=process.env.JWT_SECRET!;
    const token: string = jwt.sign({ id: userId }, secret, {
      expiresIn: +process.env.JWT_DURATION_SECONDS!,
    });

    return token;
  }

  public Verify(
    request: Request,
    response: Response,
    next: NextFunction
  ): void{
    let headerData: string | undefined = request.headers["authorization"];
    if (headerData !== undefined) {
      let headerSplit: string[] = headerData.split(" ");
      let tokenData: string = headerSplit[1];
      const secret:string=process.env.JWT_SECRET!;
      
      jwt.verify(tokenData, secret, (error, decoded) => {
        if (error) {
          response
            .status(HttpCodes.Unauthorized)
            .json(this.Error_Unauthorized(String(error)));
          return;
        } else if (decoded)next();
      });
    } else
      response
        .status(HttpCodes.Unauthorized)
        .json(this.Error_Unauthorized("Token has not been provided"));
    return;
  }
}
