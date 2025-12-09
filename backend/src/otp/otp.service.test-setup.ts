/**
 * Shared test setup for OTP Service tests
 * Contains common mocks and test utilities
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { OtpService } from './otp.service';
import { Otp } from './schemas/otp.schema';

export const mockOtp = {
  identifier: '+1234567890',
  code: '123456',
  isUsed: false,
  expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  save: jest.fn().mockResolvedValue(true),
  toObject: jest.fn(),
};

export const mockOtpModel: any = jest.fn().mockImplementation(() => mockOtp);
mockOtpModel.findOne = jest.fn();
mockOtpModel.deleteMany = jest.fn();
mockOtpModel.create = jest.fn();
mockOtpModel.findByIdAndUpdate = jest.fn();
mockOtpModel.exec = jest.fn();

export async function createOtpTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      OtpService,
      {
        provide: getModelToken(Otp.name),
        useValue: mockOtpModel,
      },
    ],
  }).compile();
}

export function resetOtpMocks() {
  jest.clearAllMocks();
}

