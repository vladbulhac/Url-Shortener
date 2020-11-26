import { ILogin } from "../ILogin";
import * as bcrypt from "bcrypt";
import { User } from "../../../Models/User.model";
import { IUserRepository } from "../../../Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "../../JWTokenServices/ITokenService";
import { IRegisterService } from "./IRegisterService";
import { ICacheService } from "../../CacheServices/ICacheService";
import { Inject } from "typescript-ioc";

require("dotenv").config();


export class RegisterService implements IRegisterService{
  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private TokenService!: ITokenService;
  @Inject
  private CacheService!:ICacheService;

  public async Register(data: User): Promise<ILogin> {
    let cachedUser:string|null = await this.CacheService.QueryCache(data.email);
    if(cachedUser)
        return {
          user: null,
          token: "",
          message: "Conflict",
        };

    let existsUser: User | null = await this.UserRepository.FindByArgument(
      JSON.stringify({ email: data.email })
    );

    if (!existsUser) {
      data.password = await bcrypt.hash(data.password, 10);

      try {
        let user: User = await this.UserRepository.Add(data);
        this.CacheService.Add(user.email,JSON.stringify(user));
        delete user.password;

        const token: string = this.TokenService.Create(String(user._id));
    
        const registerDetails: ILogin = {
          user: user,
          token: token,
          message: "Successful",
        };

        return registerDetails;

      } catch (error) {
        return {
          user: null,
          token: "",
          message: "Failure",
        };
      }
    } else
      return {
        user: null,
        token: "",
        message: "Conflict",
      };
  }
}
