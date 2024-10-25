import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document; 

@Schema({ timestamps: true, discriminatorKey: 'access_level' })
export class User {
  name: string;
  email : string;
  password: string;
  readonly _id?: mongoose.Schema.Types.ObjectId;
}

export const userSchema = SchemaFactory.createForClass(User);
