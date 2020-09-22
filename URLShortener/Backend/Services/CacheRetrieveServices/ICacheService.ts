import { Typegoose } from "typegoose";

export interface ICacheService{
    StopRedis():void;
    AddUrlToCache(key:string,data:string):void;
    QueryCacheForUrl(url:string):Promise<string|null>;
}