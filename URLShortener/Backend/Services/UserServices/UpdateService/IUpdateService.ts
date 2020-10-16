import { User } from "../../../Models/User.model";

export abstract class IUpdateService {
  abstract Update(id:string,email: string, password?: string): Promise<User | null>;
}
