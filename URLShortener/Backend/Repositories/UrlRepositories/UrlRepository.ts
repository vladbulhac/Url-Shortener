import { Url, UrlModel } from "../../Models/Url.model";
import { IUrlRepository } from "./IUrlRepository";

export class UrlRepository implements IUrlRepository {
  public Add(data: Url): Promise<Url> {
    const document = new UrlModel(data);
    return document.save();
  }
  public GetByIdentifier(url: string): Promise<Url | null> {
    return UrlModel.findOne({ shortUrl: url }).exec();
  }
  public GetAll(): Promise<Url[]> {
    return UrlModel.find().exec();
  }
  public Update(id: string, data: Url): Promise<Url | null> {
    return UrlModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  public async UpdateTTL(url: string): Promise<any> {
    return UrlModel.findOne({ shortUrl: url }).then(async (data) => {
      if (data) {
        if (data.extendedTTL === true)
          data.TTL = new Date(data.TTL!.getDate() + 4);
        else data.TTL = new Date(data.TTL!.getDate() + 2);
        await this.Update(data._id,data);
      }
    });
  }
  public RemoveExpiredUrls(date: number): Promise<any> {
    return UrlModel.deleteMany({
      lastAccessDate: { $lt: new Date(date) },
    }).exec();
  }
}
