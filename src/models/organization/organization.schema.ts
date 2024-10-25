import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ type: String , trim : true , required : true})
  name: string;

  @Prop({ type: String , trim : true})
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  organization_members: Types.ObjectId[];

  readonly _id?:Types.ObjectId;
}

export const organizationSchema = SchemaFactory.createForClass(Organization);
