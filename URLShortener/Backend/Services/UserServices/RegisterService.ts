import { ILogin } from "./ILogin";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ITokenService } from "../JWTokenServices/ITokenService";
require("dotenv").config();

export class RegisterService {
  private UserRepository:IUserRepository;
  private TokenService:ITokenService;

  constructor(userRepo:IUserRepository,tokenService:ITokenService)
  {
    this.UserRepository=userRepo;
    this.TokenService=tokenService;
  }
  public async Register(data: User): Promise<ILogin> {
    let existsUser: User | null = await this.UserRepository.FindByArgument(
      JSON.stringify({email:data.email})
    );
    if (!existsUser) {
      data.password = await bcrypt.hash(data.password, 10);
      try{
        let user:User= await this.UserRepository.Add(data);
          const token:string=this.TokenService.Create(String(user._id));

          const loginDetails: ILogin = {
            user: user,
            token: token,
            message: "Successful",
          };
          
          return loginDetails;
      }catch(error) {
        return {
          user: null,
          token: "",
          message: "Failure",
        };
      }
    }else
    return {
      user: null,
      token: "",
      message: "Conflict",
    };
  }
}
