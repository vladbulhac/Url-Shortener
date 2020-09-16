import { Typegoose } from "typegoose";

export interface IDeleteRepository{
    DeleteByIdentifier(id:string):Promise<any>;
}
