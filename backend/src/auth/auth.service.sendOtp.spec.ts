/**
 * Unit tests for Auth Service - sendOtp method
 * Tests basic OTP sending functionality
 */
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import {
  createTestModule,
  mockOtpService,
  mockConfigService,
  resetMocks,
} from './auth.service.test-setup';

describe('AuthService - sendOtp', () => {
  let service: AuthService;

  beforeEach(async () => {
    resetMocks();
    const module = await createTestModule();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOtp', () => {
    it('should generate and return OTP when Twilio is not configured', async () => {
      const dto: SendOtpDto = { phoneNumber: '+1234567890' };
      const otpCode = '123456';

      mockOtpService.createOtp.mockResolvedValue(otpCode);
      mockConfigService.get.mockReturnValue('development');

      const result = await service.sendOtp(dto);

      expect(result.message).toContain('OTP sent successfully');
      expect(result.otp).toBe(otpCode);
      expect(mockOtpService.createOtp).toHaveBeenCalledWith(dto.phoneNumber);
    });

    it('should not return OTP in production mode', async () => {
      const dto: SendOtpDto = { phoneNumber: '+1234567890' };
      const otpCode = '123456';

      mockOtpService.createOtp.mockResolvedValue(otpCode);
      mockConfigService.get.mockReturnValue('production');

      const result = await service.sendOtp(dto);

      expect(result.otp).toBeUndefined();
    });
  });
});

