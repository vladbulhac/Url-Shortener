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
import { ICacheService } from "./Services/CacheServices/ICacheService";
import { CacheService } from "./Services/CacheServices/CacheService";
import { LoginService } from "./Services/UserServices/LoginService/LoginService";
import { RegisterService } from "./Services/UserServices/RegisterService/RegisterService";
import { User } from "./Models/User.model";
import { ILoginService } from "./Services/UserServices/LoginService/ILoginService";
import { IRegisterService } from "./Services/UserServices/RegisterService/IRegisterService";

ValidateEnv();


let url_repository: IUrlRepository = new UrlRepository();
let user_repository: IUserRepository = new UserRepository();
let cache_service: ICacheService = new CacheService(
  user_repository,
  url_repository
);
let token_service: ITokenService = new TokenService();
let login_service: ILoginService= new LoginService(
  user_repository,
  token_service,
  cache_service
);
let register_service: IRegisterService<User> = new RegisterService(
  user_repository,
  token_service,
  cache_service
);
let url_conversion_service: IUrlConversionService = new UrlConversionService();

let App: Application = new Application([
  new UserController(
    user_repository,
    token_service,
    login_service,
    register_service,
    cache_service
  ),
  new UrlController(
    url_repository,
    user_repository,
    url_conversion_service,
    token_service,
    cache_service
  ),
]);

App.Listen();
