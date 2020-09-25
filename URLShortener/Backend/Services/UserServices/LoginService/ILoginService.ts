import { ILogin } from "../ILogin";

export abstract class ILoginService{
     abstract Login(email:string,password:string):Promise<ILogin>;
}