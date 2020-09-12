import { Typegoose } from "typegoose";

export interface IDeleteRepository{
    Delete():Promise<any>;
    DeleteById(id:string):Promise<any>;
}
