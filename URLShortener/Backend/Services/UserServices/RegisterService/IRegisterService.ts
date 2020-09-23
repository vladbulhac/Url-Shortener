import { ILogin } from "../ILogin";

export interface IRegisterService<T> {
  Register(data: T): Promise<ILogin>;
}
