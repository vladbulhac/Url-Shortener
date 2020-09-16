import { Url } from "../../Models/Url.model";
import { IAddRepository } from "../IAddRepository";
import { IDeleteRepository } from "../IDeleteRepository";
import { IGetRepository } from "../IGetRepository";
import { IUpdateRepository } from "../IUpdateRepository";

export interface IUrlRepository extends IAddRepository<Url>,IGetRepository<Url>,IDeleteRepository{
        DisableExpiredUrls(date:number):Promise<any>;
        UpdateTTL(url:string):Promise<Url|null|void>;
        GetMostUsedActiveUrls(offset:number):Promise<Url[]>;
};