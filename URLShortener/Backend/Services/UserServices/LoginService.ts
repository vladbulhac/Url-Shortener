import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { ILogin } from "./ILogin";
require("dotenv").config();

export class LoginService {
  public async Login(email: string, password: string): Promise<ILogin> {
    let User: User | null = await UserRepository.GetInstance().FindByEmailAndPassword(
      email,
      password
    );
    if (User) {
      let IsCorrectPassword: boolean = await bcrypt.compare(
        User.Password,
        password
      );
      if (IsCorrectPassword) {
        const JWT_SECRET: string = process.env.JWT_SECRET!;
        const Token: string = jwt.sign({ id: User._id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        delete User.Password;
        const LoginDetails: ILogin = {
          User: User,
          Token: Token,
          Message: "Successful",
        };

        return LoginDetails;
      } else
        return {
          User: null,
          Token: "",
          Message:"Failure",
        };
    } else {
      return {
        User: null,
        Token: "",
        Message: "Failure",
      };
    }
  }
}
