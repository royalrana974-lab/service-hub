/**
 * Unit tests for OTP Service (Part 1)
 * Tests OTP generation and creation
 */
import { OtpService } from './otp.service';
import {
  createOtpTestModule,
  mockOtpModel,
  mockOtp,
  resetOtpMocks,
} from './otp.service.test-setup';

describe('OtpService (Part 1)', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module = await createOtpTestModule();
    service = module.get<OtpService>(OtpService);
  });

  afterEach(() => {
    resetOtpMocks();
  });

  describe('generateOtpCode', () => {
    it('should generate a 6-digit code', () => {
      const code = service.generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
      expect(code.length).toBe(6);
    });

    it('should generate codes between 100000 and 999999', () => {
      for (let i = 0; i < 10; i++) {
        const code = service.generateOtpCode();
        const codeNum = parseInt(code, 10);
        expect(codeNum).toBeGreaterThanOrEqual(100000);
        expect(codeNum).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('createOtp', () => {
    it('should create and save a new OTP', async () => {
      const identifier = '+1234567890';
      const mockSave = jest.fn().mockResolvedValue(mockOtp);
      const mockOtpInstance = {
        ...mockOtp,
        save: mockSave,
      };

      mockOtpModel.mockReturnValue(mockOtpInstance);

      const code = await service.createOtp(identifier);

      expect(code).toMatch(/^\d{6}$/);
      expect(mockOtpModel).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    it('should set expiration to 10 minutes from now', async () => {
      const identifier = '+1234567890';
      const beforeTime = Date.now();
      const mockSave = jest.fn().mockResolvedValue(mockOtp);
      let savedExpiresAt: Date;

      mockOtpModel.mockImplementation((data: any) => {
        savedExpiresAt = data.expiresAt;
        return {
          ...mockOtp,
          expiresAt: data.expiresAt,
          save: mockSave,
        };
      });

      await service.createOtp(identifier);

      const afterTime = Date.now();
      const expiresAtTime = savedExpiresAt!.getTime();

      expect(expiresAtTime - beforeTime).toBeGreaterThanOrEqual(9 * 60 * 1000);
      expect(expiresAtTime - afterTime).toBeLessThanOrEqual(11 * 60 * 1000);
    });
  });
});

