import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUserRepository } from "./IUserRepository";
import { User, UserModel } from "../../Models/User.model";
import { Url } from "../../Models/Url.model";

export class UserRepository implements IUserRepository {


  public FindByArgument(argument: string): Promise<User | null> {
    const arg = JSON.parse(argument);
    return UserModel.findOne(arg).exec();
  }

  public Add(data: User): Promise<User> {
    const document = new UserModel(data);
    return document.save();
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

  public UpdateHistory(id:string,url:string):Promise<User|null>{
      return UserModel.findByIdAndUpdate(id,{$push:{"urlHistory":url}},{new:true}).exec();
  }
}
