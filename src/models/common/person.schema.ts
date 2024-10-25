import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, discriminatorKey: 'access_level', collection: 'person' })
export class Person {
  @Prop({ type: String , trim : true})
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({type : String , enum : ['User' , 'Admin']})
  access_level : string;

  readonly _id: mongoose.Schema.Types.ObjectId;
}
export const personSchema = SchemaFactory.createForClass(Person);
