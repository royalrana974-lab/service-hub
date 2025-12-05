/**
 * Authentication controller
 * Handles all authentication-related endpoints including:
 * - Phone number OTP authentication (send, verify, get for testing)
 */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Send OTP to phone number via SMS
   * POST /auth/phone/send-otp
   */
  @Post('phone/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  /**
   * Get OTP for testing purposes (development only)
   * POST /auth/phone/get-otp
   * Returns the latest OTP code for a phone number without sending SMS
   */
  @Post('phone/get-otp')
  @HttpCode(HttpStatus.OK)
  async getOtp(@Body() dto: { phoneNumber: string }) {
    return this.authService.getOtpForTesting(dto.phoneNumber);
  }

  /**
   * Verify OTP code and authenticate user
   * POST /auth/phone/verify-otp
   * Creates user if doesn't exist, verifies phone, and returns JWT token
   */
  @Post('phone/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
