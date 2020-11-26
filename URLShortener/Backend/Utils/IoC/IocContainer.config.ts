import { Container } from "typescript-ioc";
import { IUrlController } from "../../Controllers/UrlController/IUrlController";
import { IUserController } from "../../Controllers/UserController/IUserController";
import { UrlController } from "../../Controllers/UrlController/UrlController";
import { UserController } from "../../Controllers//UserController/UserController";
import { IUrlRepository } from "../../Repositories/UrlRepositories/IUrlRepository";
import { UrlRepository } from "../../Repositories/UrlRepositories/UrlRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { CacheService } from "../../Services/CacheServices/CacheService";
import { ICacheService } from "../../Services/CacheServices/ICacheService";
import { ITokenService } from "../../Services/JWTokenServices/ITokenService";
import { TokenService } from "../../Services/JWTokenServices/TokenService";
import { UrlConversionService } from "../../Services/UrlServices/UrlConversionService/UrlConversionService";
import { ILoginService } from "../../Services/UserServices/LoginService/ILoginService";
import { LoginService } from "../../Services/UserServices/LoginService/LoginService";
import { IRegisterService } from "../../Services/UserServices/RegisterService/IRegisterService";
import { RegisterService } from "../../Services/UserServices/RegisterService/RegisterService";
import { IUpdateService } from "../../Services/UserServices/UpdateService/IUpdateService";
import { UpdateService } from "../../Services/UserServices/UpdateService/UpdateService";
import { IUrlConversionService } from "../../Services/UrlServices/UrlConversionService/IUrlConversionService";
import { IUrlServices } from "../../Services/UrlServices/IUrlServices";
import { UrlServices } from "../../Services/UrlServices/UrlServices";

export class IocContainerConfig {
  static configure() {
    Container.bind(IUserRepository).to(UserRepository);
    Container.bind(IUrlRepository).to(UrlRepository);
    Container.bind(ICacheService).to(CacheService);
    Container.bind(ILoginService).to(LoginService);
    Container.bind(IRegisterService).to(RegisterService);
    Container.bind(ITokenService).to(TokenService);
    Container.bind(IUrlConversionService).to(UrlConversionService);
    Container.bind(IUrlServices).to(UrlServices);
    Container.bind(IUrlController).to(UrlController);
    Container.bind(IUserController).to(UserController);
    Container.bind(IUpdateService).to(UpdateService);
  }
}
