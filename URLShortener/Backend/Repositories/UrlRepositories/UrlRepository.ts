import { ICrudRepository } from "../ICrudRepository";
import { Url, UrlModel } from "../../Models/Url.model";
import { IUrlRepository } from "./IUrlRepository";

export class UrlRepository implements IUrlRepository{

    public Add(data:Url):Promise<Url>{
        const document=new UrlModel(data);
        return document.save();
    }
    public GetById(id:string):Promise<Url|null>{
        return UrlModel.findById(id).exec();
    }
    public GetAll():Promise<Url[]>{
        return UrlModel.find().exec();
    }
    public Delete():Promise<any>{
        return UrlModel.deleteMany({}).exec();
    }
   public DeleteById(id:string):Promise<any>{
        return UrlModel.findByIdAndDelete(id).exec();
    }
    public Update(id:string,data:Url):Promise<Url|null>{
        return UrlModel.findByIdAndUpdate(id,data,{new:true}).exec();
    }
    public FindByUrl(url:string):Promise<Url|null>{
        return UrlModel.findOne({"trueUrl":url}).exec();
    }
    public GetExpiredUrls(date:Date):Promise<any>{
        return UrlModel.deleteMany({lastAccessDate:{$lt:date}}).exec();
    }
}