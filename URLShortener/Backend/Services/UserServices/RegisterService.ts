import { ILogin } from "./ILogin";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
require("dotenv").config();

export class RegisterService {
  private UserRepository:IUserRepository;

  constructor(userRepo:IUserRepository)
  {
    this.UserRepository=userRepo;
  }
  public async Register(data: User): Promise<ILogin> {
    let existsUser: User | null = await this.UserRepository.ExistsFindByArgument(
      JSON.stringify({email:data.email})
    );
    if (!existsUser) {
      data.password = await bcrypt.hash(data.password, 10);
      try{
        let user:User= await this.UserRepository.Add(data);
          const JWT_SECRET: string = process.env.JWT_SECRET!;
          const token: string = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
          });
          user=JSON.parse(JSON.stringify(user));
          delete user.password;
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
