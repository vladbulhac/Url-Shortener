import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import * as cron from "node-cron";
import { Inject } from "typescript-ioc";
import { IUrlController } from "./Controllers/UrlController/IUrlController";
import { IUserController } from "./Controllers/UserController/IUserController";
import { IUrlRepository } from "./Repositories/UrlRepositories/IUrlRepository";
import { ICacheService } from "./Services/CacheServices/ICacheService";
import { IocContainerConfig } from "./Utils/IoC/IocContainer.config";

require("dotenv").config();

export class Application {
  private App: express.Application;

  @Inject
  private UrlRepository!: IUrlRepository;
  @Inject
  private UrlController!: IUrlController;
  @Inject
  private UserController!: IUserController;
  @Inject
  private CacheService!: ICacheService;

  constructor(dbUrl?: string) {
    this.App = express();

    IocContainerConfig.configure();
    this.InitializeDatabaseConnection(dbUrl);
    this.CacheService.StartCache();
    this.InitialzeMiddlewares();
    this.InitializeControllers();
    this.PeriodicDatabaseCleanup();
  }

  private InitialzeMiddlewares(): void {
    this.App.use(bodyParser.json());
    this.App.use(helmet());
    this.App.use(cors());
  }

  private InitializeDatabaseConnection(dbUrl?: string): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    try {
      const mongoUrl: string =
        dbUrl || `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
      let currentTime = new Date();
      console.log(
        `[Database][MongoDB][Processing...]: Trying to connect to database... [TIME:${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`
      );
      mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      currentTime = new Date();
      console.log(
        `[Database][MongoDB][Success]: Initializing connection complete! [TIME: ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}]`
      );
    } catch (error) {
      console.log(`[Database][MongoDB][Error]: ${error}`);
    }
  }

  private InitializeControllers(): void {
    this.App.use("/", this.UrlController.Router)
                    .use("/",this.UserController.Router);
  }

  private PeriodicDatabaseCleanup(): void {
    cron.schedule(process.env.DB_URLDISABLE_SCHEDULECRON!, async () => {
      console.log("[Database][MongoDB][Processing...] Clearing expired urls from database..." );
      await this.UrlRepository.DisableExpiredUrls(Date.now());
      console.log("[Database][MongoDB][Complete] Cleared expired urls from database..." );
    });
  }

  public Listen(): void {
    this.App.listen(process.env.PORT, () => {
      console.log(`Application is listening at port ${process.env.PORT}`);
    });
  }

  public GetCacheInstance():ICacheService{
    return this.CacheService;
  }

  public GetApplication(): express.Application {
    return this.App;
  }
}
