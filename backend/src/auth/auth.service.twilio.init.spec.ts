/**
 * Unit tests for Auth Service - Twilio initialization
 * Tests Twilio client initialization and error handling
 */
/**
 * Unit tests for Auth Service - Twilio initialization
 * Tests Twilio client initialization and error handling
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  mockUserService,
  mockOtpService,
  mockJwtService,
  mockConfigService,
  twilio,
} from './auth.service.test-setup';

describe('AuthService - Twilio Initialization', () => {
  it('should initialize Twilio client when credentials are provided', async () => {
    const mockTwilioClient = {
      messages: {
        create: jest.fn(),
      },
    };

    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'TWILIO_ACCOUNT_SID') return 'test-account-sid';
      if (key === 'TWILIO_AUTH_TOKEN') return 'test-auth-token';
      if (key === 'NODE_ENV') return 'test';
      return undefined;
    });

    (twilio as unknown as jest.Mock).mockReturnValue(mockTwilioClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    const newService = module.get<AuthService>(AuthService);
    expect(newService).toBeDefined();
  });

  it('should handle Twilio initialization errors gracefully', async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'TWILIO_ACCOUNT_SID') return 'test-account-sid';
      if (key === 'TWILIO_AUTH_TOKEN') return 'test-auth-token';
      if (key === 'NODE_ENV') return 'test';
      return undefined;
    });

    (twilio as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Twilio initialization failed');
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    const newService = module.get<AuthService>(AuthService);
    expect(newService).toBeDefined();
  });
});

