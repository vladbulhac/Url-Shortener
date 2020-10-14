import { Url } from "../../Models/Url.model";
import { User, UserModel } from "../../Models/User.model";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
  public FindByArgument(argument: string): Promise<User | null> {
    const arg = JSON.parse(argument);
    return UserModel.findOne(arg).populate("customUrls").exec();
  }
  public Add(data: User): Promise<User> {
    const document = new UserModel(data);
    return document.save();
  }
  public GetByIdentifier(id: string): Promise<User | null> {
    return UserModel.findById(id).populate("customUrls").exec();
  }
  public DeleteByIdentifier(id: string): Promise<any> {
    return UserModel.findByIdAndDelete(id).exec();
  }
  public Update(id: string, data: User): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true })
      .populate("customUrls")
      .exec();
  }
  public UpdateHistory(id: string, url: string): Promise<User | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $push: { urlHistory: url } },
      { new: true }
    )
      .populate("customUrls")
      .exec();
  }
  public UpdateCustomUrls(id: string, url: Url): Promise<User | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $push: { customUrls: url } },
      { new: true }
    )
      .populate("customUrls")
      .exec();
  }
}
