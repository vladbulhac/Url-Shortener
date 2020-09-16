import { User } from "../../Models/User.model";
import { IAddRepository } from "../IAddRepository";
import { IUpdateRepository } from "../IUpdateRepository";
import { IDeleteRepository } from "../IDeleteRepository";
import { IGetRepository } from "../IGetRepository";
import { Url } from "../../Models/Url.model";

export interface IUserRepository extends IAddRepository<User>, IUpdateRepository<User>, IGetRepository<User>, IDeleteRepository {
    FindByArgument(argument:string):Promise<User|null>;
    UpdateHistory(id:string,url:string):Promise<User|null>;
    UpdateCustomUrls(id:string,url:Url):Promise<User|null>;
}