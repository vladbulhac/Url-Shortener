
export interface ICrudRepository<T>{
    Add(data:T):T;
    GetById(id:number):T|null;
    Get():T[]|null;
    Delete():void;
    DeleteById(id:number):void;
    Update(id:number,data:T):T|null;
}