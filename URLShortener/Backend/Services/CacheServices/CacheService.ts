import redis, { RedisClient } from 'redis';
import {promisify} from 'util';
import { IUrlRepository } from '../../Repositories/UrlRepositories/IUrlRepository';
import { IUserRepository } from '../../Repositories/UserRepositories/IUserRepository';
import { ICacheService } from './ICacheService';
import * as cron from 'node-cron';

export class CacheService implements ICacheService{
    private Client!:RedisClient;
    private IsClientUp:boolean=false;
    private UserRepository:IUserRepository;
    private UrlRepository:IUrlRepository;

    constructor(userRepository:IUserRepository,urlRepository:IUrlRepository)
    {
        this.CreateRedisClient();
        this.UserRepository=userRepository;
        this.UrlRepository=urlRepository;
    }

    private CreateRedisClient():void{
        this.Client=redis.createClient();
        this.IsClientUp=this.Client.connected;
        this.Client.on('connect',()=>{
            console.log('[Cache][Redis][Success]: Connected to redis server!');
        });
        this.Client.on('error',(error)=>{
                console.log(`[Cache][Redis][Error]: ${error}`);
        });
    }

    public StopRedis():void{
        if(this.Client)
            this.Client.end(true);
    }
    public async QueryCacheForUrl(url:string):Promise<string|null>
    {
        if(this.IsClientUp===false)
            return null;

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
        if(this.IsClientUp===true){
        this.Client.setex(urlKey,900,data);
        }
    }

    private PeriodicCacheUpdate(minutes:number,UrlRepository:IUrlRepository,UserRepository:IUserRepository):void{
        cron.schedule('* 13 * * * *',async()=>{
           if(this.IsClientUp===true)
           {

           }
    });
    }
}