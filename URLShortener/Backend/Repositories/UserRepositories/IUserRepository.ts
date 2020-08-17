import { ICrudRepository } from "../ICrudRepository";
import { User } from "../../Models/User.model";

export interface IUserRepository extends ICrudRepository<User>{
    FindByEmailAndPassword(email:string,password:string):Promise<User|null>;
    ExistsFindByArgument(argument:string):Promise<User|null>
}