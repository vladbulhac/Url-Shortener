import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUserRepository } from "./IUserRepository";
import { User, UserModel } from "../../Models/User.model";

export class UserRepository implements IUserRepository {
  private static _instance: UserRepository | null = null;

  public static GetInstance(): UserRepository {
    if (!this._instance) this._instance = new UserRepository();
    return this._instance;
  }

  public FindByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    return UserModel.findOne({ email: email, password: password })
      .populate("UrlHistory")
      .exec();
  }
  public ExistsFindByArgument(argument: string): Promise<User | null> {
    const Argument = JSON.parse(argument);
    return UserModel.findOne(Argument).exec();
  }

  public Add(data: User): Promise<User> {
    const Document = new UserModel(data);
    return Document.save();
  }
  public GetById(id: string): Promise<User|null> {
      return UserModel.findById(id).populate('UrlHistory').exec();
  }
  public GetAll(): Promise<User[]> {
      return UserModel.find().populate('UrlHistory').exec();
  }
  public Delete(): Promise<any> {
      return UserModel.deleteMany({}).exec();
  }
  public DeleteById(id: string): Promise<any> {
      return UserModel.findByIdAndDelete(id).exec();
  }
  public Update(id: string, data: User): Promise<User|null> {
    return UserModel.findByIdAndUpdate(id,data,{new:true}).populate('UrlHistory').exec();
  }
}
