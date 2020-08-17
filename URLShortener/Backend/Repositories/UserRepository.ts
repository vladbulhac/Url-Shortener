import { IUserRepository } from "./IUserRepository";
import {User} from '../Models/User.model';

export class UserRepository implements IUserRepository{
    public Login(email:string,password:string):Promise<User>{

    }
    public Register(data:User):Promise<User>{

    }
    public Add(data:User):Promise<User>{

    }
    public GetById(id:number):Promise<User>{

    }
   public Get():Promise<User[]>{

    }
    public Delete():Promise<User[]>{

    }
    public DeleteById(id:number):Promise<User>{

    }
    public Update(id:number,data:User):Promise<User>{
        
    }
}