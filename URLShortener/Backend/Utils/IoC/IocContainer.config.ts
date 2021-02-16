import { Container, } from "typescript-ioc";
import { UrlControllerBase } from "../../Controllers/UrlController/UrlControllerBase";
import { UserControllerBase } from "../../Controllers/UserController/UserControllerBase";
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
import { IUrlConversionService } from "../../Services/UrlServices/UrlConversionService/IUrlConversionService";
import { IUrlServices } from "../../Services/UrlServices/IUrlServices";
import { UrlServices } from "../../Services/UrlServices/UrlServices";
import { IUserServices } from "../../Services/UserServices/IUserServices";
import { UserServices } from "../../Services/UserServices/UserServices";

export class IocContainerConfig {
  static configure() {
    Container.bind(IUserRepository).to(UserRepository);
    Container.bind(IUrlRepository).to(UrlRepository);
    Container.bind(ICacheService).to(CacheService);
    Container.bind(ITokenService).to(TokenService);
    Container.bind(IUrlConversionService).to(UrlConversionService);
    Container.bind(IUrlServices).to(UrlServices);
    Container.bind(UrlControllerBase).to(UrlController);
    Container.bind(UserControllerBase).to(UserController);
    Container.bind(IUserServices).to(UserServices);
  }
}
