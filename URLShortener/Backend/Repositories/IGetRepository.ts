import { Typegoose } from "typegoose";

export interface IGetRepository<T extends Typegoose>{
    GetByIdentifier(identifier:string):Promise<T|null>;
    GetAll():Promise<T[]>;
}