/**
 * Shared test setup for User Service tests
 * Contains common mocks and test utilities
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserRole, AuthMethod } from './schemas/user.schema';

export const mockUserModel: any = jest.fn().mockImplementation(() => mockUser);
mockUserModel.findOne = jest.fn();
mockUserModel.findById = jest.fn();
mockUserModel.findByIdAndUpdate = jest.fn();
mockUserModel.exec = jest.fn();

export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  phoneNumber: '+1234567890',
  email: 'test@example.com',
  password: '$2b$10$hashedpassword',
  isPhoneVerified: false,
  isEmailVerified: false,
  role: UserRole.CUSTOMER,
  authMethod: AuthMethod.PHONE,
  save: jest.fn(),
  toObject: jest.fn(),
};

export async function createUserTestModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getModelToken(User.name),
        useValue: mockUserModel,
      },
    ],
  }).compile();
}

export function resetUserMocks() {
  jest.clearAllMocks();
}

