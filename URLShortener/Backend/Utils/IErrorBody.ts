export interface IError{
    error:IErrorBody;
}

interface IErrorBody{
    message:string;
    errorCode:number;
}