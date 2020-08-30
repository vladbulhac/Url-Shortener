import * as mongoose from "mongoose";
import { Typegoose, prop, pre } from "typegoose";

@pre<Url>("save", function() {
  this.lastAccessDate = new Date(Date.now());
})

export class Url extends Typegoose {
 // _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true, maxlength: 50 })
  shortUrl!: string;

  @prop({ index:true,required: true, maxlength: 350 })
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
  schemaOptions: { toJSON: { virtuals: true }, collection: "urls",_id:false},
});
