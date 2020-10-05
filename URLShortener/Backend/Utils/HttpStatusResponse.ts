import { IError } from "./IErrorBody";

export abstract class HttpStatusResponse {
  private RespondWith_MessageAndCode(
    message: string,
    errorCode: number
  ): IError {
    const error: IError = {
      error: {
        message: message,
        errorCode: errorCode,
      },
    };
    return error;
  }

  protected Error_BadRequest(
    message: string = "Bad Request, Wrong Arguments",
    errorCode: number = 400
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }

  protected Error_Unauthorized(
    message: string = "Unauthorized",
    errorCode: number = 401
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }

  protected Error_Forbidden(
    message: string = "Forbidden",
    errorCode: number = 403
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }

  protected Error_NotFound(
    message: string = "Not Found",
    errorCode = 404
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }

  protected Error_Conflict(
    message: string = "Conflict, Already Exists",
    errorCode: number = 409
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }

  protected Error_InternalServerError(
    message: string = "Internal Server Error",
    errorCode: number = 500
  ): IError {
    return this.RespondWith_MessageAndCode(message, errorCode);
  }
}
