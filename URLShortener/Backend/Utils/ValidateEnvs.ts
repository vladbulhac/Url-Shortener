import {cleanEnv,str,port, num} from 'envalid';

export function ValidateEnv():void{
    cleanEnv(process.env,{
        JWT_SECRET:str(),
        JWT_DURATION_SECONDS:num(),
        PORT:port(),
        CACHE_ENTRY_TTL_SECONDS:num(),
        CACHE_PERIODIC_UPDATE_MINUTES:num(),
        URL_TTLINCREASE_DAYS:num(),
        URL_TTLINCREASE_EXTENDED_DAYS:num(),
        DB_URLDISABLE_SCHEDULECRON:str(),
        MONGO_USER:str(),
        MONGO_PASSWORD:str(),
        MONGO_PATH:str(),
        URL_CONVERSIONCHARACTERS:str()
    });
}