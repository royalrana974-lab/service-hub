/**
 * DTO for sending OTP
 * Validates phone number format (E.164 international format)
 */
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in valid international format',
  })
  phoneNumber: string;
}
