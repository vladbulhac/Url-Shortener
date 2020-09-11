import { ValidateEnv } from "./Utils/ValidateEnvs";
import { UserController } from "./Controllers/UserController";
import { UrlController } from "./Controllers/UrlController";
import { UserRepository } from "./Repositories/UserRepositories/UserRepository";
import { TokenService } from "./Services/JWTokenServices/TokenService";
import { Application } from "./app";
import { UrlRepository } from "./Repositories/UrlRepositories/UrlRepository";
import { UrlConversionService } from "./Services/UrlServices/UrlConversionService";

ValidateEnv();
let App: Application = new Application([
  new UserController(new UserRepository(), new TokenService()),
  new UrlController(
    new UrlRepository(),
    new UserRepository(),
    new UrlConversionService(),
    new TokenService()
  ),
]);

App.Listen();
