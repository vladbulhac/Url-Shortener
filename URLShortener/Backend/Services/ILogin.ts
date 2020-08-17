import { User } from "../Models/User.model";

export interface ILogin{
    User:User|null,
    Token:string,
    Message:string
}