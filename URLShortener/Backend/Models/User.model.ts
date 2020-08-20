import * as mongoose from "mongoose";
import { Typegoose, prop, arrayProp, Ref } from "typegoose";
import { Url } from "./Url.model";

export class User extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ unique:true, required: true, maxlength: 25 })
  email!: string;

  @prop({ required: true, minlength: 5 })
  password!: string;

  @arrayProp({ itemsRef: "Url" })
  urlHistory?: Ref<Url>[];
}

export const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: false }, collection: "users" },
});
