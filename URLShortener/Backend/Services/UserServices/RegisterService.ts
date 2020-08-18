import { ILogin } from "./ILogin";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../Models/User.model";
import { UserRepository } from "../../Repositories/UserRepositories/UserRepository";
import { IUserRepository } from "../../Repositories/UserRepositories/IUserRepository";
require("dotenv").config();

export class RegisterService {
  private UserRepository:IUserRepository;

  constructor(UserRepo:IUserRepository)
  {
    this.UserRepository=UserRepo;
  }
  public async Register(data: User): Promise<ILogin> {
    let ExistsUser: User | null = await this.UserRepository.ExistsFindByArgument(
      data.Email
    );
    if (!ExistsUser) {
      data.Password = await bcrypt.hash(data.Password, 10);
      this.UserRepository
        .Add(data)
        .then((User) => {
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
        })
        .catch((Err) => {
          return {
            User: null,
            Token: "",
            Message: "Failure",
          };
        });
    }
    return {
      User: null,
      Token: "",
      Message: "Failure",
    };
  }
}
