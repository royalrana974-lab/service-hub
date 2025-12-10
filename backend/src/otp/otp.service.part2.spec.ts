/**
 * Unit tests for OTP Service (Part 2)
 * Tests OTP verification and cleanup
 */
import { OtpService } from './otp.service';
import {
  createOtpTestModule,
  mockOtpModel,
  mockOtp,
  resetOtpMocks,
} from './otp.service.test-setup';

describe('OtpService (Part 2)', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module = await createOtpTestModule();
    service = module.get<OtpService>(OtpService);
  });

  afterEach(() => {
    resetOtpMocks();
  });

  describe('verifyOtp', () => {
    it('should return true for valid OTP', async () => {
      const identifier = '+1234567890';
      const code = '123456';
      const validOtp = {
        ...mockOtp,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        save: jest.fn().mockResolvedValue(true),
      };

      mockOtpModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(validOtp),
      });

      const result = await service.verifyOtp(identifier, code);

      expect(result).toBe(true);
      expect(validOtp.isUsed).toBe(true);
      expect(validOtp.save).toHaveBeenCalled();
    });

    it('should return false for invalid code', async () => {
      const identifier = '+1234567890';
      const code = '999999';

      mockOtpModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.verifyOtp(identifier, code);

      expect(result).toBe(false);
    });

    it('should return false for expired OTP', async () => {
      const identifier = '+1234567890';
      const code = '123456';
      const expiredOtp = {
        ...mockOtp,
        code,
        expiresAt: new Date(Date.now() - 1000),
      };

      mockOtpModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(expiredOtp),
      });

      const result = await service.verifyOtp(identifier, code);

      expect(result).toBe(false);
    });

    it('should return false for already used OTP', async () => {
      const identifier = '+1234567890';
      const code = '123456';

      // Since used OTPs are filtered out by the query, findOne should return null
      mockOtpModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.verifyOtp(identifier, code);

      expect(result).toBe(false);
    });
  });

  describe('getLatestOtp', () => {
    it('should return latest active OTP', async () => {
      const identifier = '+1234567890';
      const activeOtp = {
        ...mockOtp,
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };

      mockOtpModel.findOne = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(activeOtp),
      });

      const result = await service.getLatestOtp(identifier);

      expect(result).toBe('123456');
      expect(mockOtpModel.findOne).toHaveBeenCalledWith({
        identifier,
        isUsed: false,
        expiresAt: { $gt: expect.any(Date) },
      });
    });

    it('should return null if no active OTP found', async () => {
      const identifier = '+1234567890';

      mockOtpModel.findOne = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.getLatestOtp(identifier);

      expect(result).toBeNull();
    });
  });

  describe('cleanupExpiredOtps', () => {
    it('should delete expired OTPs', async () => {
      mockOtpModel.deleteMany = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 5 }),
      });

      await service.cleanupExpiredOtps();

      expect(mockOtpModel.deleteMany).toHaveBeenCalledWith({
        expiresAt: { $lt: expect.any(Date) },
      });
    });
  });
});

