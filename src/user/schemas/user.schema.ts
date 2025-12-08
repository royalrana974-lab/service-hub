/**
 * User Schema
 * Defines the structure for User documents in MongoDB
 * Supports phone number OTP authentication
 * Includes role-based access control (CUSTOMER, PROVIDER)
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * User roles enum
 * CUSTOMER - Regular service consumer
 * PROVIDER - Service provider
 */
export enum UserRole {
  CUSTOMER = 'customer',
  PROVIDER = 'provider',
}

/**
 * Authentication methods enum
 * PHONE - Phone number OTP authentication
 * EMAIL - Email and password authentication
 */
export enum AuthMethod {
  PHONE = 'phone',
  EMAIL = 'email',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // Phone number (optional, used for phone authentication)
  @Prop({ required: false })
  phoneNumber?: string;

  // Email address (optional, sparse index allows multiple nulls)
  // Note: unique constraint is handled by schema.index() below, not in @Prop
  @Prop({ required: false })
  email?: string;

  // Hashed password (optional, not used for OAuth users)
  @Prop({ required: false })
  password?: string;

  // Phone verification status
  @Prop({ default: false })
  isPhoneVerified: boolean;

  // Email verification status
  @Prop({ default: false })
  isEmailVerified: boolean;

  // User role (defaults to CUSTOMER)
  @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  // Authentication method used to register/login
  @Prop({ enum: AuthMethod, required: false })
  authMethod?: AuthMethod;

  // User's full name
  @Prop({ required: false })
  fullname?: string;

  // User's first name
  @Prop({ required: false })
  firstName?: string;

  // User's last name
  @Prop({ required: false })
  lastName?: string;

  // Profile picture URL (typically from OAuth providers)
  @Prop({ required: false })
  profilePicture?: string;

  // Automatically added by timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for efficient queries
UserSchema.index({ phoneNumber: 1 }); // Index for phone number lookups
UserSchema.index({ email: 1 }, { unique: true, sparse: true }); // Unique email index (allows nulls)
