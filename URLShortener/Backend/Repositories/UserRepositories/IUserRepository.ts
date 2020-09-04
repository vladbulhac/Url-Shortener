import { ICrudRepository } from "../ICrudRepository";
import { User } from "../../Models/User.model";
import { Url } from "../../Models/Url.model";

export interface IUserRepository extends ICrudRepository<User>{
    FindByArgument(argument:string):Promise<User|null>;
    UpdateHistory(id:string,url:string):Promise<User|null>;
}