import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document; 

@Schema({ timestamps: true, discriminatorKey: 'access_level' })
export class User {
  name: string;
  email : string;
  password: string;
  access_level : string
  readonly _id?: Types.ObjectId;
}

export const userSchema = SchemaFactory.createForClass(User);
