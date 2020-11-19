import * as mongoose from "mongoose";
import { Typegoose, prop, arrayProp, Ref, pre, index } from "typegoose";
import { Url } from "./Url.model";

@pre<User>("save", function () {
  this.urlHistory = [];
  this.customUrls = [];
})
@index({email:1})
export class User extends Typegoose {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ unique: true, required: true, maxlength: 25 })
  email!: string;

  @prop({ required: true, minlength: 5 })
  password?: string;

  @prop()
  urlHistory?: string[];

  @arrayProp({ itemsRef: Url })
  customUrls?: Ref<Url>[];
}

export const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  schemaOptions: { toJSON: { virtuals: false }, collection: "users" },
});
