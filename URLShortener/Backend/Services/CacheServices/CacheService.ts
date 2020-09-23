import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "./ICacheService";
import * as cron from "node-cron";

export class CacheService implements ICacheService {
  private Client!: RedisClient;
  private IsClientUp: boolean;
  private UserRepository: IUserRepository;
  private UrlRepository: IUrlRepository;

  constructor(userRepository: IUserRepository, urlRepository: IUrlRepository) {
    this.CreateRedisClient();
    this.IsClientUp = this.Client.connected;
    this.UserRepository = userRepository;
    this.UrlRepository = urlRepository;
    this.PeriodicCacheUpdate(5);
  }

  private CreateRedisClient(): void {
    this.Client = redis.createClient();
    this.Client.on("connect", () => {
      console.log("[Cache][Redis][Success]: Connected to redis server!");
      this.IsClientUp = true;
    });
    this.Client.on("error", (error) => {
      console.log(`[Cache][Redis][Error]: ${error}`);
      this.IsClientUp = false;
    });
  }

  public StopRedis(): void {
    if (this.Client) this.Client.end(true);
  }

  public async QueryCache(key: string): Promise<string | null> {
    if (this.IsClientUp === false) return null;

    const getValue = promisify(this.Client.get).bind(this.Client);

    try {
      const cachedValue: string | null = await getValue(key);
      return cachedValue;
    } catch (error) {
      throw new Error("CacheUnavailable");
    }
  }

  public Add(key: string, data: string): void {
    if (this.IsClientUp === true) {
      this.Client.setex(key, 900, data);
    }
  }

  public Delete(key:string):void{
    if(this.IsClientUp===true)
      this.Client.del(key);
  }

  private PeriodicCacheUpdate(
    minutes: number,
  ): void {
    cron.schedule(`* ${minutes} * * * *`, async () => {

      if (this.IsClientUp === true) {
        this.Client.keys("*", async (error, keys) => {
          if (error) console.log(error);
          else {
            for (let key of keys) {
              this.Client.get(key, async (error, reply) => {
                  console.log(reply);
                if (reply !== null && error === null) {
                  const obj = JSON.parse(reply);
                  if (obj["email"]) {
                    const user = await this.UserRepository.FindByArgument(
                      obj["email"]
                    );
                    if (user) {
                      if (
                        obj["urlHistory"].length !== user["urlHistory"]!.length
                      )
                        this.Client.setex(key, 900, JSON.stringify(user));
                    }
                  } else {
                    const url = await this.UrlRepository.GetByIdentifier(
                      obj["shortUrl"]
                    );
                    if (url) {
                      if (url["isActive"] === false) this.Client.del(key);
                      if (obj["accessNumber"] != url["accessNumber"])
                        this.Client.setex(key, 900, JSON.stringify(url));
                    }
                  }
                }
              });
            }
          }
        });
      }
    });
  }
}
