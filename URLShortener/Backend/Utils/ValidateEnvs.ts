import {cleanEnv,str,port} from 'envalid';


export function ValidateEnv():void{
    cleanEnv(process.env,{
        JWT_SECRET:str(),
        PORT:port(),
        MONGO_USER:str(),
        MONGO_PASSWORD:str(),
        MONGO_PATH:str()
    });
}