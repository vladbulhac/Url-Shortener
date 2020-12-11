import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "./ICacheService";
import * as cron from "node-cron";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class CacheService implements ICacheService {
  private Client!: RedisClient;

  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private UrlRepository!: IUrlRepository;

  public StartCache(): void {
    this.CreateRedisClient();
    this.PeriodicCacheUpdate();
  }

  private CreateRedisClient(): void {
    this.Client = redis.createClient();
    this.Client.on("connect", () => {
      console.log("[Cache][Redis][Success]: Connected to redis server!");
    });
    this.Client.on("error", (error) => {
      console.log(`[Cache][Redis][Error]: ${error}`);
    });
  }

  public StopCache(): void {
    if (this.Client && this.Client.connected === true) {
      this.Client.end(true);
    }
  }

  public async QueryCache(key: string): Promise<string | null> {
    if (this.Client.connected === false) return null;

    const getValue = promisify(this.Client.get).bind(this.Client);

    try {
      const cachedValue: string | null = await getValue(key);
      return cachedValue;
    } catch (error) {
      throw new Error("CacheUnavailable");
    }
  }

  public Add(key: string, data: string): void {
    if (this.Client.connected === true) {
      this.Client.setex(key, +process.env.CACHE_ENTRY_TTL_SECONDS!, data);
    }
  }

  public Delete(key: string): void {
    if (this.Client.connected === true) this.Client.del(key);
  }

  public DeleteAll(): void {
    if (this.Client.connected === true) {
      this.Client.keys("*", (error, keys) => {
        if (error) console.log(error);
        else for (let key of keys) this.Client.del(key);
      });
    }
  }

  private PeriodicCacheUpdate(): void {
    cron.schedule(
      `*/${+process.env.CACHE_PERIODIC_UPDATE_MINUTES!} * * * *`,
      async () => {
        await this.CleanOrUpdateTTL();
      }
    );
  }

  public async CleanOrUpdateTTL(): Promise<void> {
    if (this.Client.connected === true) {
      console.log(
        "[Cache][Redis][Processing...] Cleaning and updating entries in cache..."
      );
      this.Client.keys("*", async (error, keys) => {
        if (error) console.log(error);
        else {
          for (let key of keys) {
            this.Client.get(key, async (error, reply) => {
              if (reply !== null && error === null) {
                const obj = JSON.parse(reply);
                if (obj["email"]) {
                  await this.CleanOrUpdateUserTTL(key, obj);
                } else {
                  await this.CleanOrUpdateUrlTTL(key, obj);
                }
              }
            });
          }
        }
      });
      console.log(
        "[Cache][Redis][Complete] Finished cleaning and updating the entries in cache!"
      );
    }
  }

  private async CleanOrUpdateUrlTTL(key: any, cachedUrl: any): Promise<void> {
    if (this.Client.connected === true) {
      const url = await this.UrlRepository.GetByIdentifier(
        cachedUrl["shortUrl"]
      );
      if (url) {
        if (url["isActive"] === false) this.Client.del(key);
        else {
          if (cachedUrl["accessNumber"] != url["accessNumber"])
            this.Client.setex(
              key,
              +process.env.CACHE_ENTRY_TTL_SECONDS!,
              JSON.stringify(url)
            );
        }
      } else this.Delete(key);
    }
  }

  private async CleanOrUpdateUserTTL(key: any, cachedUser: any): Promise<void> {
    if (this.Client.connected === true) {
      const user = await this.UserRepository.FindByArgument(
        JSON.stringify({ email: cachedUser.email })
      );
      if (user) {
        if (cachedUser["urlHistory"].length !== user["urlHistory"]!.length)
          this.Client.setex(
            key,
            +process.env.CACHE_ENTRY_TTL_SECONDS!,
            JSON.stringify(user)
          );
      } else this.Delete(key);
    }
  }
}
