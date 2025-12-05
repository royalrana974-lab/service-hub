/**
 * Authentication service
 * Handles all authentication business logic including:
 * - OTP generation and SMS sending via Twilio
 * - User authentication and JWT token generation
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthMethod } from '../user/schemas/user.schema';
import twilio from 'twilio';

@Injectable()
export class AuthService {
  private twilioClient: ReturnType<typeof twilio> | null = null;

  constructor(
    private userService: UserService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      try {
        this.twilioClient = twilio(accountSid, authToken);
        console.log('Twilio SMS service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Twilio:', error);
      }
    } else {
      console.log('Twilio not configured - OTP will be returned in response for testing');
    }
  }

  async sendOtp(dto: SendOtpDto): Promise<{ message: string; otp?: string }> {
    const code = await this.otpService.createOtp(dto.phoneNumber);
    const isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';

    if (this.twilioClient) {
      try {
        const messagingServiceSid = this.configService.get<string>('TWILIO_MESSAGING_SERVICE_SID');
        const twilioPhoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

        const messageOptions: {
          body: string;
          to: string;
          messagingServiceSid?: string;
          from?: string;
        } = {
          body: `Your SERVICEHUB verification code is: ${code}`,
          to: dto.phoneNumber,
        };

        if (messagingServiceSid) {
          messageOptions.messagingServiceSid = messagingServiceSid;
          console.log(`Using Messaging Service: ${messagingServiceSid}`);
        } else if (twilioPhoneNumber) {
          messageOptions.from = twilioPhoneNumber;
          console.log(`Using direct phone number: ${twilioPhoneNumber}`);
        } else {
          throw new Error('TWILIO_MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER must be configured');
        }

        await this.twilioClient.messages.create(messageOptions);
        console.log(`SMS sent successfully to ${dto.phoneNumber}`);

        return {
          message: 'OTP sent successfully via SMS',
          otp: isDevelopment ? code : undefined,
        };
      } catch (error: any) {
        console.error('Twilio SMS error:', error);

        let errorMessage = 'OTP sent successfully (SMS failed, OTP shown for testing)';

        if (error.code === 21608) {
          errorMessage =
            'OTP sent successfully (Recipient number not verified - Trial account restriction. Verify number in Twilio Console or upgrade account)';
          console.error(
            ' Tip: Verify recipient number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified',
          );
        } else if (error.code === 21659) {
          errorMessage =
            'OTP sent successfully (Invalid sender number - check TWILIO_PHONE_NUMBER in .env)';
        } else if (error.code === 21266) {
          errorMessage = 'OTP sent successfully (Sender and recipient cannot be the same number)';
        }

        return {
          message: errorMessage,
          otp: isDevelopment ? code : undefined,
        };
      }
    } else {
      console.log(`OTP for ${dto.phoneNumber}: ${code} (Twilio not configured)`);
      return {
        message: 'OTP sent successfully (Twilio not configured)',
        otp: isDevelopment ? code : undefined,
      };
    }
  }

  async getOtpForTesting(phoneNumber: string): Promise<{ otp: string | null; message: string }> {
    const isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';

    if (!isDevelopment) {
      throw new Error('This endpoint is only available in development mode');
    }

    const otp = await this.otpService.getLatestOtp(phoneNumber);

    if (!otp) {
      return {
        otp: null,
        message: 'No active OTP found for this phone number. Please request a new OTP first.',
      };
    }

    return {
      otp,
      message: 'Latest OTP retrieved successfully',
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ access_token: string; user: any }> {
    const isValid = await this.otpService.verifyOtp(dto.phoneNumber, dto.code);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    let user = await this.userService.findByPhone(dto.phoneNumber);

    if (!user) {
      user = await this.userService.createUser({
        phoneNumber: dto.phoneNumber,
        authMethod: AuthMethod.PHONE,
      });
    }

    if (!user.isPhoneVerified) {
      await this.userService.verifyPhone(user.id);
      user.isPhoneVerified = true;
    }

    const payload = { sub: user.id, phoneNumber: user.phoneNumber };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    };
  }
}
