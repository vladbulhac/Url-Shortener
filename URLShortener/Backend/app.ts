import express from "express";
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import * as cron from 'node-cron';
import {IController} from './Controllers/IController';
import { IUrlRepository } from "./Repositories/UrlRepositories/IUrlRepository";
import { UrlRepository } from "./Repositories/UrlRepositories/UrlRepository";
require('dotenv').config();


export class Application{
    private App:express.Application;
    
    constructor(controllers:IController[],dbUrl?:string)
    {
        this.App=express();

        this.InitializeDataBaseConnection(dbUrl);
        this.InitialzeMiddlewares();
        this.InitializeControllers(controllers);
        this.PeriodicUrlCleanup(new UrlRepository());
    }

    private InitialzeMiddlewares():void{
        this.App.use(bodyParser.json());
        this.App.use(helmet());
        this.App.use(cors());
    }

    private InitializeDataBaseConnection(dbUrl?:string):void{
        const{
                MONGO_USER,
                MONGO_PASSWORD,
                MONGO_PATH
        }=process.env;
        try{
        const mongoUrl:string=dbUrl || `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
            let currentTime=new Date();
            console.log(`Trying to connect to database... [TIME:${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`);
            mongoose.connect(mongoUrl,
                    {
                        useNewUrlParser:true,
                        useUnifiedTopology:true,
                        useFindAndModify:false,
                        useCreateIndex:true
                    });
                    currentTime=new Date();
                    console.log(`Initializing connection complete! [TIME: ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`);
        }catch(error){
                console.log(error);
        }
    }

    private InitializeControllers(controllers:IController[]):void{
        controllers.forEach(controller=>{
            this.App.use('/',controller.Router);
        });
    }

    private PeriodicUrlCleanup(UrlRepository:IUrlRepository):void{
            cron.schedule('* * 23 * * *',async function(){
                    await UrlRepository.RemoveExpiredUrls(Date.now());
            });
    }

    public Listen():void{
        this.App.listen(process.env.PORT,()=>{
            console.log(`Application is listening at port ${process.env.PORT}`);
        });
    }

    public GetApplication():express.Application{
        return this.App;
    }
}

