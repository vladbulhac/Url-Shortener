import { Url } from "../../Models/Url.model";
import { User } from "../../Models/User.model";
import { ICrudRepository } from "../ICrudRepository";

export abstract class IUserRepository extends ICrudRepository<User> {
    abstract FindByArgument(argument:string):Promise<User|null>;
    abstract UpdateHistory(id:string,url:string):Promise<User|null>;
    abstract UpdateCustomUrls(id:string,url:Url):Promise<User|null>;
}