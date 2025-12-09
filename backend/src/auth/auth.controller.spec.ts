/**
 * Unit tests for Auth Controller
 * Tests all authentication endpoints
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
    getOtpForTesting: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should send OTP successfully', async () => {
      const sendOtpDto: SendOtpDto = {
        phoneNumber: '+1234567890',
      };
      const expectedResult = {
        message: 'OTP sent successfully via SMS',
        otp: '123456',
      };

      mockAuthService.sendOtp.mockResolvedValue(expectedResult);

      const result = await controller.sendOtp(sendOtpDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.sendOtp).toHaveBeenCalledWith(sendOtpDto);
      expect(mockAuthService.sendOtp).toHaveBeenCalledTimes(1);
    });

    it('should handle sendOtp errors', async () => {
      const sendOtpDto: SendOtpDto = {
        phoneNumber: '+1234567890',
      };
      const error = new Error('Failed to send OTP');

      mockAuthService.sendOtp.mockRejectedValue(error);

      await expect(controller.sendOtp(sendOtpDto)).rejects.toThrow('Failed to send OTP');
    });
  });

  describe('getOtp', () => {
    it('should get OTP for testing', async () => {
      const phoneNumber = '+1234567890';
      const expectedResult = {
        phoneNumber: '+1234567890',
        otp: '123456',
        expiresAt: new Date(),
      };

      mockAuthService.getOtpForTesting.mockResolvedValue(expectedResult);

      const result = await controller.getOtp({ phoneNumber });

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.getOtpForTesting).toHaveBeenCalledWith(phoneNumber);
      expect(mockAuthService.getOtpForTesting).toHaveBeenCalledTimes(1);
    });

    it('should handle getOtp errors', async () => {
      const phoneNumber = '+1234567890';
      const error = new Error('OTP not found');

      mockAuthService.getOtpForTesting.mockRejectedValue(error);

      await expect(controller.getOtp({ phoneNumber })).rejects.toThrow('OTP not found');
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        phoneNumber: '+1234567890',
        code: '123456',
      };
      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: '123',
          phoneNumber: '+1234567890',
        },
      };

      mockAuthService.verifyOtp.mockResolvedValue(expectedResult);

      const result = await controller.verifyOtp(verifyOtpDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.verifyOtp).toHaveBeenCalledWith(verifyOtpDto);
      expect(mockAuthService.verifyOtp).toHaveBeenCalledTimes(1);
    });

    it('should handle verifyOtp errors', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        phoneNumber: '+1234567890',
        code: '000000',
      };
      const error = new Error('Invalid OTP');

      mockAuthService.verifyOtp.mockRejectedValue(error);

      await expect(controller.verifyOtp(verifyOtpDto)).rejects.toThrow('Invalid OTP');
    });
  });
});
