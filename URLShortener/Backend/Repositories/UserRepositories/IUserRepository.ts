import { ICrudRepository } from "../ICrudRepository";
import { User } from "../../Models/User.model";

export interface IUserRepository extends ICrudRepository<User>{
    FindByArgument(argument:string):Promise<User|null>
}