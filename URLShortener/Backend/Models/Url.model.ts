import * as mongoose from "mongoose";
import { index, pre, prop, Typegoose } from "typegoose";

@pre<Url>("save", function() {
  let today:Date=new Date();
  this.TTL = new Date(today.getDate()+7);
})
@index({shortUrl:1,trueUrl:1})
@index({isActive:true,accessNumber:-1})
export class Url extends Typegoose {
 _id!: mongoose.Schema.Types.ObjectId;

  @prop({ unique:true,required: true})
  shortUrl!: string;

  @prop({ required: true})
  trueUrl!: string;

  @prop({ min: 0,default:0,max:Number.MAX_VALUE })
  accessNumber!: number;

  @prop({required:true,default:new Date(new Date().getDate()+7)})
  TTL!: Date;

  @prop()
  extendedTTL?:boolean;

  @prop({required:true,default:true})
  isActive!:boolean;
}

export const UrlModel = new Url().getModelForClass(Url, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: false }, collection: "urls"},
});
