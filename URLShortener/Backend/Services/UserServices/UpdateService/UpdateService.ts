import { Inject } from "typescript-ioc";
import bcrypt from "bcrypt";
import { User } from "../../../Models/User.model";
import { IUserRepository } from "../../../Repositories/UserRepositories/IUserRepository";
import { ICacheService } from "../../CacheServices/ICacheService";
import { IUpdateService } from "./IUpdateService";
import { exception } from "console";

export class UpdateService implements IUpdateService {
  @Inject
  private UserRepository!: IUserRepository;
  @Inject
  private CacheService!: ICacheService;

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
