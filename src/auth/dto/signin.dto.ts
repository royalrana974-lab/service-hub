/**
 * DTO for user signin
 * Validates email and password
 */
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}