
export interface ICrudRepository<T>{
    Add(data:T):Promise<T>;
    GetById(id:number):Promise<T>;
    Get():Promise<T[]>;
    Delete():Promise<T[]>;
    DeleteById(id:number):Promise<T>;
    Update(id:number,data:T):Promise<T>;
}