import { ICrudRepository } from "./ICrudRepository";
import { User } from "../Models/User.model";

export interface IUserRepository extends ICrudRepository<User>{
    Login(email:string,password:string):void;
    Register(data:User):void;
}