/**
 * Unit tests for Auth Service - Twilio SMS (Part 1)
 * Tests SMS sending with Messaging Service and direct phone number
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
  mockUserService,
  mockOtpService,
  mockJwtService,
  mockConfigService,
  twilio,
  createTwilioTestModule,
  createMockTwilioClient,
} from './auth.service.test-setup';

describe('AuthService - Twilio SMS (Part 1)', () => {
  let mockTwilioClient: any;

  beforeEach(() => {
    mockTwilioClient = createMockTwilioClient();
  });

  it('should send SMS using Messaging Service when configured', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_MESSAGING_SERVICE_SID') return 'MG123456789';
        if (key === 'NODE_ENV') return 'development';
        return undefined;
      }),
    };

    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);
    mockTwilioClient.messages.create.mockResolvedValue({ sid: 'SM123' });

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toBe('OTP sent successfully via SMS');
    expect(result.otp).toBe(otpCode);
    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith({
      body: `Your SERVICEHUB verification code is: ${otpCode}`,
      to: dto.phoneNumber,
      messagingServiceSid: 'MG123456789',
    });
  });

  it('should send SMS using direct phone number when Messaging Service not configured', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_PHONE_NUMBER') return '+1987654321';
        if (key === 'NODE_ENV') return 'development';
        return undefined;
      }),
    };

    mockTwilioClient.messages.create.mockResolvedValue({ sid: 'SM123' });
    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toBe('OTP sent successfully via SMS');
    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith({
      body: `Your SERVICEHUB verification code is: ${otpCode}`,
      to: dto.phoneNumber,
      from: '+1987654321',
    });
  });

  it('should handle Twilio error 21608 (unverified recipient)', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_PHONE_NUMBER') return '+1987654321';
        if (key === 'NODE_ENV') return 'development';
        return undefined;
      }),
    };

    const twilioError = { code: 21608, message: 'Unverified recipient' };
    mockTwilioClient.messages.create.mockRejectedValue(twilioError);
    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toContain('Recipient number not verified');
    expect(result.otp).toBe(otpCode);
  });

  it('should handle Twilio error 21659 (invalid sender)', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_PHONE_NUMBER') return '+1987654321';
        if (key === 'NODE_ENV') return 'development';
        return undefined;
      }),
    };

    const twilioError = { code: 21659, message: 'Invalid sender' };
    mockTwilioClient.messages.create.mockRejectedValue(twilioError);
    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toContain('Invalid sender number');
    expect(result.otp).toBe(otpCode);
  });
});

