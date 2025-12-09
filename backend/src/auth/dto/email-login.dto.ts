/**
 * DTO for email login
 * Validates email and password fields
 */
import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

export class EmailLoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password: string;
}

