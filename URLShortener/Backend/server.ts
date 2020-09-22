import { ValidateEnv } from "./Utils/ValidateEnvs";
import { UserController } from "./Controllers/UserController";
import { UrlController } from "./Controllers/UrlController";
import { UserRepository } from "./Repositories/UserRepositories/UserRepository";
import { TokenService } from "./Services/JWTokenServices/TokenService";
import { Application } from "./app";
import { UrlRepository } from "./Repositories/UrlRepositories/UrlRepository";
import { UrlConversionService } from "./Services/UrlServices/UrlConversionService";
import { IUrlRepository } from "./Repositories/UrlRepositories/IUrlRepository";
import { IUserRepository } from "./Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "./Services/JWTokenServices/ITokenService";
import { IUrlConversionService } from "./Services/UrlServices/IUrlConversionService";
import { ICacheService } from "./Services/CacheRetrieveServices/ICacheService";
import { CacheService } from "./Services/CacheRetrieveServices/CacheService";
import { LoginService } from "./Services/UserServices/LoginService";
import { RegisterService } from "./Services/UserServices/RegisterService";

ValidateEnv();

let url_repository: IUrlRepository = new UrlRepository();
let user_repository: IUserRepository = new UserRepository();
let token_service: ITokenService = new TokenService();
let login_service:LoginService=new LoginService(user_repository,token_service);
let register_service:RegisterService=new RegisterService(user_repository,token_service);
let url_conversion_service: IUrlConversionService = new UrlConversionService();
let cache_service:ICacheService=new CacheService();

let App: Application = new Application([
  new UserController(user_repository, token_service,login_service,register_service),
  new UrlController(
    url_repository,
    user_repository,
    url_conversion_service,
    token_service,
    cache_service
  ),
]);

App.Listen();
