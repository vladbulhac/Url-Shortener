import bcrypt from "bcrypt";
import { User } from "../../../Models/User.model";
import { ILogin } from "../ILogin";
import { IUserRepository } from "../../../Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "../../JWTokenServices/ITokenService";
import { ILoginService } from "./ILoginService";
import { ICacheService } from "../../CacheServices/ICacheService";
import { Inject } from "typescript-ioc";


require("dotenv").config();

export class LoginService implements ILoginService{
  @Inject
  private UserRepository!:IUserRepository;
  @Inject
  private TokenService!:ITokenService;
  @Inject
  private CacheService!:ICacheService;

  public async Login(email: string, password: string): Promise<ILogin> {

    let cachedUser:string|null = await this.CacheService.QueryCache(email);
    let user:User|null=null;
    if(cachedUser)
      user=JSON.parse(cachedUser);
    else
      user= await this.UserRepository.FindByArgument(
        JSON.stringify({email:email})
      );

    if (user) {
      let isCorrectPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );

      if (isCorrectPassword) {
        const token:string=this.TokenService.Create(String(user._id));
        this.CacheService.Add(user.email,JSON.stringify(user));
        delete user!.password;

        const loginDetails: ILogin = {
          user: user,
          token: token,
          message: "Successful",
        };
        return loginDetails;
      } else
        return {
          user: null,
          token: "",
          message:"Failure",
        };
    } else {
      return {
        user: null,
        token: "",
        message: "Failure",
      };
    }
  }
}
