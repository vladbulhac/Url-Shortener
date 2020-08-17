import { ICrudRepository } from "./ICrudRepository";
import { User } from "../Models/User.model";

export interface IUserRepository extends ICrudRepository<User>{
    Login(email:string,password:string):Promise<User>;
    Register(data:User):Promise<User>;
}