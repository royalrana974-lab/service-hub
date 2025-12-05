/**
 * Unit tests for Auth Service - getOtpForTesting method
 * Tests OTP retrieval for testing purposes
 */
import { AuthService } from './auth.service';
import {
  createTestModule,
  mockOtpService,
  mockConfigService,
  resetMocks,
} from './auth.service.test-setup';

describe('AuthService - getOtpForTesting', () => {
  let service: AuthService;

  beforeEach(async () => {
    resetMocks();
    const module = await createTestModule();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OTP in development mode', async () => {
    const phoneNumber = '+1234567890';
    const otpCode = '123456';

    mockConfigService.get.mockReturnValue('development');
    mockOtpService.getLatestOtp.mockResolvedValue(otpCode);

    const result = await service.getOtpForTesting(phoneNumber);

    expect(result.otp).toBe(otpCode);
    expect(result.message).toBe('Latest OTP retrieved successfully');
  });

  it('should throw error in production mode', async () => {
    const phoneNumber = '+1234567890';

    mockConfigService.get.mockReturnValue('production');

    await expect(service.getOtpForTesting(phoneNumber)).rejects.toThrow(
      'This endpoint is only available in development mode',
    );
  });

  it('should return null if no OTP found', async () => {
    const phoneNumber = '+1234567890';

    mockConfigService.get.mockReturnValue('development');
    mockOtpService.getLatestOtp.mockResolvedValue(null);

    const result = await service.getOtpForTesting(phoneNumber);

    expect(result.otp).toBeNull();
    expect(result.message).toContain('No active OTP found');
  });
});

