import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true, unique: true })
  refId: string; // reference id/slug

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  icon?: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

