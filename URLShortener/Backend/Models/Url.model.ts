import * as mongoose from "mongoose";
import { pre, prop, Typegoose } from "typegoose";

@pre<Url>("save", function() {
  let today:Date=new Date();
  this.TTL = new Date(today.getDate()+7);
})

export class Url extends Typegoose {
 _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true})
  shortUrl!: string;

  @prop({ index:true,required: true})
  trueUrl!: string;

  @prop({ min: 0,default:0,max:Number.MAX_VALUE })
  accessNumber!: number;

  @prop({ index:true})
  TTL!: Date;

  @prop()
  extendedTTL?:boolean;

  @prop({required:true,default:true})
  isActive!:boolean;
}

export const UrlModel = new Url().getModelForClass(Url, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: true }, collection: "urls"},
});
