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

  public async Update(
    id: string,
    email: string,
    password?: string
  ): Promise<User | null> {
    const requestBody: { email: string; password?: string } = {
      email: email,
    };
    if (password) requestBody["password"] = await bcrypt.hash(password, 10);
    try {
      const updatedUser: User | null = await this.UserRepository.Update(
        id,
        <User>requestBody
      );
      if (!updatedUser) return null;
      
      this.CacheService.Add(updatedUser.email,JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }

/*     this.UserRepository.Update(id, <User>requestBody)
      .then((updatedData) => {
        if (updatedData) {
          response.status(HttpCodes.Ok).json({ data: { updatedData } });
          this.CacheService.Add(updatedData.email, JSON.stringify(updatedData));
        } else response.status(HttpCodes.NotFound).json(this.Error_NotFound);
      })
      .catch((error) => {
        response
          .status(HttpCodes.BadRequest)
          .json(this.Error_BadRequest(String(error)));
      }); */
  }
}
