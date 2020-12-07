import { User } from "../../Models/User.model";

export interface IAuthenticationData{
    user:User|null,
    token:string,
    message:string
}