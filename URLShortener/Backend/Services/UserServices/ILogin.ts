import { User } from "../../Models/User.model";

export interface ILogin{
    user:User|null,
    token:string,
    message:string
}