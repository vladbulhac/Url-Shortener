import { Typegoose } from "typegoose";

export interface IAddRepository<T extends Typegoose>{
    Add(data:T):Promise<T>;
}