import * as mongoose from "mongoose";
import { Typegoose, prop, arrayProp, Ref } from "typegoose";
import { Url } from "./Url.model";

export class User extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ index: true,unique:true, required: true, maxlength: 25 })
  Email!: string;

  @prop({ index: true, required: true, minlength: 5 })
  Password!: string;

  @prop({ required: true,default:false })
  HasOptionalSettings!: boolean;

  @arrayProp({ itemsRef: "Url" })
  UrlHistory?: Ref<Url>[];
}

export const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: true }, collection: "users" },
});
