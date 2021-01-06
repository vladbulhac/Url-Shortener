import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { ICacheService } from "./ICacheService";
import { Singleton } from "typescript-ioc";

@Singleton
export class CacheService implements ICacheService {
  private Client!: RedisClient;

  public StartCache(): void {
    this.CreateRedisClient();
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
}
