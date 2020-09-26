
export interface ErrorDTO {
  error: ErrorBody;
}

interface ErrorBody{
    message:string;
    errorCode:number;
}