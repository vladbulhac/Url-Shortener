import { Typegoose } from "typegoose";

export interface ICrudRepository<T extends Typegoose>{
    Add(data:T):Promise<T>;
    GetById(id:string):Promise<T|null>;
    GetAll():Promise<T[]>;
    Delete():Promise<any>;
    DeleteById(id:string):Promise<any>;
    Update(id:string,data:T):Promise<T|null>;
}