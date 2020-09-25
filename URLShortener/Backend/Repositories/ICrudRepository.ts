import { Typegoose } from "typegoose";
import { IAddGetDelRepository } from "./IAddGetDelRepository";

export abstract class ICrudRepository<T extends Typegoose> extends IAddGetDelRepository<T>{
    abstract Update(id:string,data:T):Promise<T|null>;
}