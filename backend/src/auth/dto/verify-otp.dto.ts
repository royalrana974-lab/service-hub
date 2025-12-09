/**
 * DTO for verifying OTP
 * Validates phone number and 6-digit OTP code
 */
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in valid international format',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP code must be 6 digits' })
  code: string;
}
