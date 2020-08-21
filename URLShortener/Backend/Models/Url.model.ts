import * as mongoose from "mongoose";
import { Typegoose, prop, pre } from "typegoose";
import { UrlShortConversionService } from "../Services/UrlServices/UrlShortConversionService";

@pre<Url>("save", function() {
  this.lastAccessDate = new Date(Date.now());
  if(this._id===undefined || this._id===null)
    this._id=mongoose.Types.ObjectId();
    let shortService:UrlShortConversionService=new UrlShortConversionService();
    let shortUrl:string=shortService.GenerateShortUrl(this._id);
    this.shortUrl=shortUrl;
})

export class Url extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true, maxlength: 50 })
  shortUrl!: string;

  @prop({ unique:true,required: true, maxlength: 350 })
  trueUrl!: string;

  @prop({ required: true, min: 0 })
  accessNumber!: number;

  @prop({ index:true,required: true })
  lastAccessDate!: Date;

  @prop()
  extendedLifeTime?:boolean;
}

export const UrlModel = new Url().getModelForClass(Url, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: true }, collection: "urls" },
});
