/**
 * Unit tests for Auth Service - verifyOtp method
 * Tests OTP verification and user authentication
 */
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { mockUser } from './auth.service.test-setup';
import { AuthMethod } from '../user/schemas/user.schema';
import {
  createTestModule,
  mockOtpService,
  mockUserService,
  mockJwtService,
  resetMocks,
} from './auth.service.test-setup';

describe('AuthService - verifyOtp', () => {
  let service: AuthService;

  beforeEach(async () => {
    resetMocks();
    const module = await createTestModule();
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should verify OTP and return JWT token for existing user', async () => {
    const dto: VerifyOtpDto = {
      phoneNumber: '+1234567890',
      code: '123456',
    };
    const accessToken = 'jwt-token';

    mockOtpService.verifyOtp.mockResolvedValue(true);
    mockUserService.findByPhone.mockResolvedValue(mockUser);
    mockUserService.verifyPhone.mockResolvedValue(mockUser);
    mockJwtService.sign.mockReturnValue(accessToken);

    const result = await service.verifyOtp(dto);

    expect(result.access_token).toBe(accessToken);
    expect(result.user.phoneNumber).toBe(dto.phoneNumber);
    expect(mockOtpService.verifyOtp).toHaveBeenCalledWith(dto.phoneNumber, dto.code);
    expect(mockJwtService.sign).toHaveBeenCalled();
  });

  it('should create new user if not exists', async () => {
    const dto: VerifyOtpDto = {
      phoneNumber: '+1234567890',
      code: '123456',
    };
    const accessToken = 'jwt-token';
    const newUser = { ...mockUser, id: 'new-user-id' };

    mockOtpService.verifyOtp.mockResolvedValue(true);
    mockUserService.findByPhone.mockResolvedValue(null);
    mockUserService.createUser.mockResolvedValue(newUser);
    mockUserService.verifyPhone.mockResolvedValue(newUser);
    mockJwtService.sign.mockReturnValue(accessToken);

    const result = await service.verifyOtp(dto);

    expect(result.access_token).toBe(accessToken);
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      phoneNumber: dto.phoneNumber,
      authMethod: AuthMethod.PHONE,
    });
  });

  it('should throw UnauthorizedException for invalid OTP', async () => {
    const dto: VerifyOtpDto = {
      phoneNumber: '+1234567890',
      code: '999999',
    };

    mockOtpService.verifyOtp.mockResolvedValue(false);

    await expect(service.verifyOtp(dto)).rejects.toThrow(UnauthorizedException);
    expect(mockUserService.findByPhone).not.toHaveBeenCalled();
  });

  it('should verify phone if not already verified', async () => {
    const dto: VerifyOtpDto = {
      phoneNumber: '+1234567890',
      code: '123456',
    };
    const unverifiedUser = { ...mockUser, isPhoneVerified: false };
    const accessToken = 'jwt-token';

    mockOtpService.verifyOtp.mockResolvedValue(true);
    mockUserService.findByPhone.mockResolvedValue(unverifiedUser);
    mockUserService.verifyPhone.mockResolvedValue(unverifiedUser);
    mockJwtService.sign.mockReturnValue(accessToken);

    await service.verifyOtp(dto);

    expect(mockUserService.verifyPhone).toHaveBeenCalledWith(unverifiedUser.id);
  });
});

