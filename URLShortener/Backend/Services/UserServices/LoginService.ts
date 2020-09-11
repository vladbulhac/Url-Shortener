import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { ILogin } from "./ILogin";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "../JWTokenServices/ITokenService";
require("dotenv").config();

export class LoginService {
  private UserRepository:IUserRepository;
  private TokenService:ITokenService;

  constructor(userRepo:IUserRepository,tokenService:ITokenService)
  {
      this.UserRepository=userRepo;
      this.TokenService=tokenService;
  }
  public async Login(email: string, password: string): Promise<ILogin> {
    let user: User | null = await this.UserRepository.FindByArgument(
      JSON.stringify({email:email})
    );

    if (user) {
      let isCorrectPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );
      if (isCorrectPassword) {
        const token:string=this.TokenService.Create(String(user._id));
        
        user=JSON.parse(JSON.stringify(user));
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
