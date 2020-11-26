import { User } from "../../../Models/User.model";

export abstract class IUpdateService {
  abstract UpdateCredentials(id:string,email: string, password?: string): Promise<User | null>;
}
