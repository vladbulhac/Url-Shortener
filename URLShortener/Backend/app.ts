import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import {IController} from './Controllers/IController';
require('dotenv').config();

export class Application{
    private App:express.Application;

    constructor(controllers:IController[]){
        this.App=express();

        this.InitializeDBConnection();
        this.InitialzeMiddlewares();
        this.InitializeControllers(controllers);
    }

    private InitialzeMiddlewares():void{
        this.App.use(bodyParser);
        this.App.use(helmet);
        this.App.use(cors);
    }

    private InitializeDBConnection():void{
        const{
                MONGO_USER,
                MONGO_PASSWORD,
                MONGO_PATH
        }=process.env;
        try{
            let currentTime=new Date();
            console.log(`Trying to connect to MongoDB... [TIME:${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`);
            mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
                    {
                        useNewUrlParser:true
                        ,useUnifiedTopology:true,
                        useFindAndModify:false,
                        useCreateIndex:true
                    });
        }catch(error){
                console.log(error);
        }finally{
            let currentTime=new Date();
            console.log(`Connected to MongoDB! [TIME: ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`);
        }
    }

    private InitializeControllers(controllers:IController[]):void{
        controllers.forEach(controller=>{
            this.App.use('/',controller.Router);
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