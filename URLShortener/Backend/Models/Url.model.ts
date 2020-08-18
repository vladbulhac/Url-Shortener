import * as mongoose from "mongoose";
import { Typegoose, prop, pre } from "typegoose";
import { ConvertShortService } from "../Services/UrlServices/ConvertShortService";

@pre<Url>("save", function() {
  this.LastAccessDate = new Date(Date.now());
  if(this._id===undefined || this._id===null)
    this._id=mongoose.Schema.Types.ObjectId;
    let ShortService:ConvertShortService=new ConvertShortService();
    let ShortUrl:string=ShortService.ToShortTransform(this.TrueUrl);
    this.ShortUrl=ShortUrl;
})

export class Url extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true, maxlength: 50 })
  ShortUrl!: string;

  @prop({ unique:true,required: true, maxlength: 350 })
  TrueUrl!: string;

  @prop({ required: true, min: 0 })
  AccessNumber!: number;

  @prop({ required: true })
  LastAccessDate!: Date;

  @prop({ required: true })
  IsPrivileged!: boolean;
}

export const UrlModel = new Url().getModelForClass(Url, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: true }, collection: "urls" },
});
