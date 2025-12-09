/**
 * OTP Schema
 * Defines the structure for OTP documents in MongoDB
 * Includes automatic expiration and unique constraints
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  // Phone number or email address associated with the OTP
  @Prop({ required: true })
  identifier: string;

  // 6-digit OTP code
  @Prop({ required: true })
  code: string;

  // Whether the OTP has been used (prevents reuse)
  @Prop({ default: false })
  isUsed: boolean;

  // Expiration timestamp (OTPs expire after 10 minutes)
  @Prop({ required: true })
  expiresAt: Date;

  // Automatically added by timestamps: true
  createdAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

// Create compound index for identifier and code (ensures uniqueness)
OtpSchema.index({ identifier: 1, code: 1 }, { unique: true });
// Index for expiration (used by MongoDB TTL feature)
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
