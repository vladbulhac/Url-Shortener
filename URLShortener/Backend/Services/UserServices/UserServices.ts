import { Inject } from "typescript-ioc";
import { User } from "../../Models/User.model";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../CacheServices/ICacheService";
import { IUserServices } from "./IUserServices";
import bcrypt from 'bcrypt';
import { IAuthenticationData } from "./IAuthenticationData";
import { ITokenService } from "../JWTokenServices/ITokenService";

//require("dotenv").config();

export class UserServices implements IUserServices{
    @Inject
    private CacheService!:ICacheService;
    @Inject
    private TokenService!:ITokenService;
    @Inject
    private UserRepository!:IUserRepository;


    public async Login(email: string, password: string): Promise<IAuthenticationData> {

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
            user.password!
          );
    
          if (isCorrectPassword) {
            const token:string=this.TokenService.Create(String(user._id));
            this.CacheService.Add(user.email,JSON.stringify(user));
            delete user.password;
    
            const loginDetails: IAuthenticationData = {
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

    public async Register(data: User): Promise<IAuthenticationData> {
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
        
            const registerDetails: IAuthenticationData = {
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

    public async UpdateCredentials(
        id: string,
        email: string,
        password?: string
      ): Promise<User | null> {
        const requestBody: { email: string; password?: string } = {
          email: email,
        };
        if (password) requestBody["password"] = await bcrypt.hash(password, 10);
    
          const updatedUser: User | null = await this.UserRepository.Update(
            id,
            <User>requestBody
          );
          if (!updatedUser) return null;
          
          this.CacheService.Add(updatedUser.email,JSON.stringify(updatedUser));
          return updatedUser;
        }
}