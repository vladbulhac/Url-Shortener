import { User } from "../../Models/User.model";
import { IAuthenticationData } from "./IAuthenticationData";

export abstract class IUserServices {
    abstract UpdateCredentials(id:string,email: string, password?: string): Promise<User | null>;
    abstract Register(data: User): Promise<IAuthenticationData>;
    abstract Login(email:string,password:string):Promise<IAuthenticationData>;
}