import * as mongoose from "mongoose";
import { Typegoose, prop, pre } from "typegoose";

@pre<Url>("save", function() {
  this.TTL = new Date(Date.now()+7 * 24 * 60 * 60 * 1000);
})

export class Url extends Typegoose {
 _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true})
  shortUrl!: string;

  @prop({ index:true,required: true})
  trueUrl!: string;

  @prop({ min: 0,default:0 })
  accessNumber?: number;

  @prop({ index:true})
  TTL?: Date;

  @prop()
  extendedTTL?:boolean;

  @prop({required:true,default:true})
  isActive!:boolean;
}

export const UrlModel = new Url().getModelForClass(Url, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: true }, collection: "urls"},
});
