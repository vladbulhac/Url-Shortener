import * as mongoose from "mongoose";
import { Typegoose, prop, post } from "typegoose";

@post<Url>("save", (url) => {
  url.LastAccessDate = new Date(Date.now());
})

export class Url extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index:true,unique:true,required: true, maxlength: 50 })
  Hash!: string;

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
