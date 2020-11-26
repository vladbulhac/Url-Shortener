import { Url } from "../../Models/Url.model";
import { User, UserModel } from "../../Models/User.model";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
  public async FindByArgument(argument: string): Promise<User | null> {
    const arg = JSON.parse(argument);
    return await UserModel.findOne(arg).populate("customUrls").exec();
  }
  public async Add(data: User): Promise<User> {
    const document = new UserModel(data);
    return await document.save();
  }
  public async GetByIdentifier(id: string): Promise<User | null> {
    return await UserModel.findById(id).populate("customUrls").exec();
  }
  public async DeleteByIdentifier(id: string): Promise<any> {
    return await UserModel.findByIdAndDelete(id).exec();
  }
  public async Update(id: string, data: User): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(id, data, { new: true })
      .populate("customUrls")
      .exec();
  }
  public async UpdateHistory(id: string, url: string): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $push: { urlHistory: url } },
      { new: true }
    )
      .populate("customUrls")
      .exec();
  }
  public async UpdateCustomUrls(id: string, url: Url): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $push: { customUrls: url } },
      { new: true }
    )
      .populate("customUrls")
      .exec();
  }
}
