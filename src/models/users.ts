import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop()
  first_name: String;

  @Prop()
  last_name: String;

  @Prop({ unique: true, required: true })
  email: String;

  @Prop({ type: String, enum: ['Admin', 'User'] })
  role: String;

  @Prop()
  phone_number: String;

  @Prop()
  address: String;

  @Prop()
  country: String;

  @Prop()
  state: String;

  @Prop()
  city: String;

  @Prop()
  zip_code: Number;

  @Prop({ select: false })
  password: String;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
