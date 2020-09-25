import { Typegoose } from "typegoose";

export abstract class IAddGetDelRepository<T extends Typegoose>
{
    abstract Add(data:T):Promise<T>;
    abstract DeleteByIdentifier(id:string):Promise<any>;
    abstract GetByIdentifier(identifier:string):Promise<T|null>;
}