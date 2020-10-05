import { Url } from "../../Models/Url.model";
import { IAddGetDelRepository } from "../IAddGetDelRepository";

export abstract class IUrlRepository extends IAddGetDelRepository<Url> {
        abstract DisableExpiredUrls(date:number):Promise<any>;
        abstract UpdateTTL(url:string):Promise<Url|null|void>;
        abstract GetMostUsedActiveUrls(offset:number):Promise<Url[]>;
        abstract SetActive(identifier:string):Promise<Url|null>;
};