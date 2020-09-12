import { Url } from "../../Models/Url.model";
import { IAddRepository } from "../IAddRepository";
import { IGetRepository } from "../IGetRepository";
import { IUpdateRepository } from "../IUpdateRepository";

export interface IUrlRepository extends IAddRepository<Url>,IGetRepository<Url>, IUpdateRepository<Url>{
        RemoveExpiredUrls(date:number):Promise<any>;
        UpdateTTL(url:string):Promise<any>;
};