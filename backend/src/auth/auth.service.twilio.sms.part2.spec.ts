/**
 * Unit tests for Auth Service - Twilio SMS (Part 2)
 * Tests Twilio error handling and edge cases
 */
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
  mockOtpService,
  mockConfigService,
  twilio,
  createTwilioTestModule,
  createMockTwilioClient,
} from './auth.service.test-setup';

describe('AuthService - Twilio SMS (Part 2)', () => {
  let mockTwilioClient: any;

  beforeEach(() => {
    mockTwilioClient = createMockTwilioClient();
  });

  it('should handle Twilio error 21266 (same sender/recipient)', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_PHONE_NUMBER') return '+1234567890';
        if (key === 'NODE_ENV') return 'development';
        return undefined;
      }),
    };

    const twilioError = { code: 21266, message: 'Same sender/recipient' };
    mockTwilioClient.messages.create.mockRejectedValue(twilioError);
    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toContain('Sender and recipient cannot be the same');
    expect(result.otp).toBe(otpCode);
  });

  it('should handle generic Twilio errors', async () => {
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

    const twilioError = { code: 99999, message: 'Generic error' };
    mockTwilioClient.messages.create.mockRejectedValue(twilioError);
    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module = await createTwilioTestModule(mockConfig);
    const service = module.get<AuthService>(AuthService);
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.message).toContain('SMS failed');
    expect(result.otp).toBe(otpCode);
  });

  it('should handle missing Twilio configuration', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
      if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
      if (key === 'NODE_ENV') return 'development';
      return undefined;
    });

    const module = await createTwilioTestModule(mockConfigService);
    const service = module.get<AuthService>(AuthService);

    mockTwilioClient.messages.create.mockRejectedValue(
      new Error('TWILIO_MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER must be configured'),
    );
    (service as any).twilioClient = mockTwilioClient;

    const result = await service.sendOtp(dto);

    expect(result.otp).toBe(otpCode);
  });

  it('should not return OTP in production when Twilio succeeds', async () => {
    const dto: SendOtpDto = { phoneNumber: '+1234567890' };
    const otpCode = '123456';

    mockOtpService.createOtp.mockResolvedValue(otpCode);
    const mockConfig = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'TWILIO_ACCOUNT_SID') return 'test-sid';
        if (key === 'TWILIO_AUTH_TOKEN') return 'test-token';
        if (key === 'TWILIO_PHONE_NUMBER') return '+1987654321';
        if (key === 'NODE_ENV') return 'production';
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
    expect(result.otp).toBeUndefined();
  });
});

