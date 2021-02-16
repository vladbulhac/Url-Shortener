import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { HttpCodes } from "../../Utils/HttpCodes.enum";
import { IError } from "../../Utils/IError";
import { ITokenService } from "./ITokenService";
require("dotenv").config();

export class TokenService implements ITokenService {
  public Create(userId: string): string {
    const secret: string = process.env.JWT_SECRET!;
    const token: string = jwt.sign({ id: userId }, secret, {
      expiresIn: +process.env.JWT_DURATION_SECONDS!,
    });

    return token;
  }

  public Verify(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    let headerData: string | undefined = request.headers["authorization"];
    if (headerData !== undefined) {
      let headerSplit: string[] = headerData.split(" ");
      let tokenData: string = headerSplit[1];
      const secret: string = process.env.JWT_SECRET!;

      jwt.verify(tokenData, secret, (error, decoded) => {
        if (error) {
          const errorResponse: IError = {
            error: {
              message: String(error),
              errorCode: HttpCodes.Unauthorized,
            },
          };
          response.status(HttpCodes.Unauthorized).json(errorResponse);
          return;
        } else if (decoded) next();
      });
    } else {
      const errorResponse: IError = {
        error: {
          message: "Token has not been provided",
          errorCode: HttpCodes.Unauthorized,
        },
      };
      response.status(HttpCodes.Unauthorized).json(errorResponse);
      return;
    }
  }
}
