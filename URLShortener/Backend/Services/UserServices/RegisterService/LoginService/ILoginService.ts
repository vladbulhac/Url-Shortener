import { ILogin } from "../../ILogin";

export interface ILoginService{
    Login(email:string,password:string):Promise<ILogin>;
}