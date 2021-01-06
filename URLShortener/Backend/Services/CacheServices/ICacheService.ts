export abstract class ICacheService{
     abstract StartCache():void;
     abstract  StopCache():void;
     abstract Add(key:string,data:string):void;
     abstract QueryCache(key:string):Promise<string|null>;
     abstract Delete(key:string):void;
     abstract DeleteAll():void;
}