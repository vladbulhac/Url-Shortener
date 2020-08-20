import { ICrudRepository } from "../ICrudRepository";
import { User } from "../../Models/User.model";

export interface IUserRepository extends ICrudRepository<User>{
    ExistsFindByArgument(argument:string):Promise<User|null>
}