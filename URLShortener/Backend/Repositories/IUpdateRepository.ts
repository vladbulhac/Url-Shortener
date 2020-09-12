import { Typegoose } from "typegoose";

export interface IUpdateRepository<T extends Typegoose>{
    Update(id:string,data:T):Promise<T|null>;
}