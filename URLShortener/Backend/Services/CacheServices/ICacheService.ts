import { Typegoose } from "typegoose";

export interface ICacheService{
    StopRedis():void;
    Add(key:string,data:string):void;
    QueryCache(key:string):Promise<string|null>;
    Delete(key:string):void;
}