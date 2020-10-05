import { User } from "../../../Models/User.model";
import { ILogin } from "../ILogin";

export abstract class IRegisterService {
   abstract Register(data: User): Promise<ILogin>;
}
