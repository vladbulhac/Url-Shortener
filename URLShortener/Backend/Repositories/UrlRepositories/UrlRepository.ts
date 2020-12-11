import { Url, UrlModel } from "../../Models/Url.model";
import { IUrlRepository } from "./IUrlRepository";

export class UrlRepository implements IUrlRepository {
  public async Add(data: Url): Promise<Url> {
    const document = new UrlModel(data);
    return await document.save();
  }
  public async GetByIdentifier(url: string): Promise<Url | null> {
    return await UrlModel.findOne({
      $or: [{ shortUrl: url }, { trueUrl: url }],
    }).exec();
  }
  public async UpdateTTL(url: string): Promise<Url | null | void> {
    return await UrlModel.findOne({ shortUrl: url }).then(async (data) => {
      if (data) {
        if (data.extendedTTL === true)
          data.TTL = new Date(data.TTL!.getDate() + (+process.env.URL_TTLINCREASE_EXTENDED_DAYS!));
        else
          data.TTL = new Date(data.TTL!.getDate() + (+process.env.URL_TTLINCREASE_DAYS!));
        data.accessNumber++;

        await UrlModel.findByIdAndUpdate(data._id, data).exec();
      }
    });
  }
  public async SetActive(identifier: string): Promise<Url | null> {
    return await UrlModel.findByIdAndUpdate(
      identifier,
      { isActive: true },
      { new: true }
    ).exec();
  }
  public async DeleteByIdentifier(url: string): Promise<any> {
    return await UrlModel.findOneAndDelete({ shortUrl: url }).exec();
  }
  public async DisableExpiredUrls(date: number): Promise<any> {
    return await UrlModel.updateMany(
      { TTL: { $lt: new Date(date) } },
      { $set: { isActive: false } }
    ).exec();
  }
  public async GetMostUsedActiveUrls(offset: number): Promise<Url[]> {
    return await UrlModel.find({ isActive: true })
      .sort({ accessNumber: "desc" })
      .skip(offset)
      .limit(10)
      .exec();
  }
}
