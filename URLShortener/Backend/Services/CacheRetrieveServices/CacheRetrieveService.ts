import redis, { RedisClient } from 'redis';
import {promisify} from 'util';
import { Url } from '../../Models/Url.model';
import { ICacheRetrieveService } from './ICacheRetrieveService';

export class CacheRetrieveService implements ICacheRetrieveService{
    private Client:RedisClient;

    constructor()
    {
        this.Client=redis.createClient();
    }

    public StopRedis():void{
        if(this.Client)
            this.Client.end(true);
    }
    public async QueryCacheForUrl(url:string):Promise<string|null>
    {
        const getValue=promisify(this.Client.get).bind(this.Client);

        try{
            const cachedUrl:string|null=await getValue(url);
            return cachedUrl;
        }
        catch(error)
        {
            throw new Error("Could not access the cache");
        }
    }

    public  AddUrlToCache(urlKey:string,data:string):void{
        this.Client.setex(urlKey,3600,data);
    }
}