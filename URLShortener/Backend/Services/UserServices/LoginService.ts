import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { ILogin } from "./ILogin";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
require("dotenv").config();

export class LoginService {
  private UserRepository:IUserRepository;

  constructor(userRepo:IUserRepository)
  {
      this.UserRepository=userRepo;
  }
  public async Login(email: string, password: string): Promise<ILogin> {
    let user: User | null = await this.UserRepository.ExistsFindByArgument(
      JSON.stringify({email:email})
    );

    if (user) {
      let isCorrectPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );
      if (isCorrectPassword) {
        const JWT_SECRET: string = process.env.JWT_SECRET!;
        const token: string = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });
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
