import { ICrudRepository } from "../ICrudRepository";
import { Url } from "../../Models/Url.model";

export interface IUrlRepository extends ICrudRepository<Url>{
    FindByUrl(url:string):Promise<Url|null>;
    GetExpiredUrls(date:Date):Promise<any>;
};