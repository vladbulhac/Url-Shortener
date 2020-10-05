import { Url, UrlModel } from "../../Models/Url.model";
import { IUrlRepository } from "./IUrlRepository";

export class UrlRepository implements IUrlRepository {
  public Add(data: Url): Promise<Url> {
    const document = new UrlModel(data);
    return document.save();
  }
  public GetByIdentifier(url: string): Promise<Url | null> {
    return UrlModel.findOne({ shortUrl: url}).exec();
  }
  public async UpdateTTL(url: string): Promise<Url|null|void> {
    return UrlModel.findOne({ shortUrl: url }).then(async (data) => {
      if (data) {
        if (data.extendedTTL === true)
          data.TTL = new Date(data.TTL!.getDate() + 2);
        else data.TTL = new Date(data.TTL!.getDate() + 1);
        data.accessNumber=data.accessNumber!+1;

        await UrlModel.findByIdAndUpdate(data._id,data).exec();
      }
    });
  }
  public async SetActive(identifier:string):Promise<Url|null>{
    return UrlModel.findByIdAndUpdate(identifier,{isActive:true},{new:true}).exec();
  }
  public DeleteByIdentifier(url:string):Promise<any>{
    return UrlModel.deleteOne({shortUrl:url}).exec();
  }
  public DisableExpiredUrls(date: number): Promise<any> {
    return UrlModel.updateMany(
      {lastAccessDate: { $lt: new Date(date) }},{$set:{isActive:false}
    }).exec();
  }
  public GetMostUsedActiveUrls(offset:number):Promise<Url[]>{
    return UrlModel.find({isActive:true}).sort({accessNumber:'desc'}).skip(offset).limit(10).exec();
  }
}
