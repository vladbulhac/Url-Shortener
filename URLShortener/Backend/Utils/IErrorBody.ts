export interface IError{
    Error:IErrorBody;
}

interface IErrorBody{
    Message:string;
    ErrorCode:number;
}