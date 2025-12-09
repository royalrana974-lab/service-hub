/**
 * Shared test setup for Auth Service tests
 * Contains common mocks and test utilities
 */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { UserRole } from '../user/schemas/user.schema';
import twilio from 'twilio';

// Mock Twilio module
jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn(),
    },
  }));
});

export const mockUserService = {
  findByPhone: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  verifyPhone: jest.fn(),
  updateUser: jest.fn(),
};

export const mockOtpService = {
  createOtp: jest.fn(),
  verifyOtp: jest.fn(),
  getLatestOtp: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    if (key === 'TWILIO_ACCOUNT_SID' || key === 'TWILIO_AUTH_TOKEN') {
      return undefined;
    }
    if (key === 'NODE_ENV') {
      return 'test';
    }
    if (key === 'TWILIO_PHONE_NUMBER') {
      return undefined;
    }
    return undefined;
  }),
};

export const mockUser = {
  id: '507f1f77bcf86cd799439011',
  phoneNumber: '+1234567890',
  email: 'test@example.com',
  role: UserRole.CUSTOMER,
  isPhoneVerified: false,
  isEmailVerified: true,
  firstName: 'John',
  lastName: 'Doe',
  profilePicture: 'https://example.com/pic.jpg',
};

export async function createTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: UserService,
        useValue: mockUserService,
      },
      {
        provide: OtpService,
        useValue: mockOtpService,
      },
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
    ],
  }).compile();
}

export function resetMocks() {
  mockConfigService.get.mockImplementation((key: string) => {
    if (key === 'TWILIO_ACCOUNT_SID' || key === 'TWILIO_AUTH_TOKEN') {
      return undefined;
    }
    if (key === 'NODE_ENV') {
      return 'test';
    }
    if (key === 'TWILIO_PHONE_NUMBER') {
      return undefined;
    }
    return undefined;
  });
  jest.clearAllMocks();
}

export { twilio };

export function createTwilioTestModule(mockConfig: any): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      AuthService,
      { provide: UserService, useValue: mockUserService },
      { provide: OtpService, useValue: mockOtpService },
      { provide: JwtService, useValue: mockJwtService },
      { provide: ConfigService, useValue: mockConfig },
    ],
  }).compile();
}

export function createMockTwilioClient() {
  return {
    messages: {
      create: jest.fn(),
    },
  };
}

