/**
 * Unit tests for User Service (Part 1)
 * Tests user find operations and basic CRUD
 */
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserDocument, UserRole, AuthMethod } from './schemas/user.schema';
import {
  createUserTestModule,
  mockUserModel,
  mockUser,
  resetUserMocks,
} from './user.service.test-setup';

jest.mock('bcrypt');

describe('UserService (Part 1)', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await createUserTestModule();
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    resetUserMocks();
  });

  describe('findByPhone', () => {
    it('should find user by phone number', async () => {
      const phoneNumber = '+1234567890';
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByPhone(phoneNumber);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ phoneNumber });
    });

    it('should return null if user not found', async () => {
      const phoneNumber = '+1234567890';
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByPhone(phoneNumber);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      mockUserModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(id);

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('createUser', () => {
    it('should create user with phone number', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        authMethod: AuthMethod.PHONE,
      };
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      const mockUserInstance = {
        ...mockUser,
        save: mockSave,
      };

      mockUserModel.mockReturnValue(mockUserInstance);

      const result = await service.createUser(userData);

      expect(result).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
    });

    it('should hash password if provided', async () => {
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const userData = {
        email: 'test@example.com',
        password,
        authMethod: AuthMethod.PHONE,
      };
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      const mockUserInstance = {
        ...mockUser,
        save: mockSave,
      };

      mockUserModel.mockReturnValue(mockUserInstance);

      await service.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should set phone verification to false when phone provided', async () => {
      const userData = {
        phoneNumber: '+1234567890',
        authMethod: AuthMethod.PHONE,
      };
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      let newUser: any;

      mockUserModel.mockImplementation((data: any) => {
        newUser = {
          ...mockUser,
          isPhoneVerified: data.isPhoneVerified,
          save: mockSave,
        };
        return newUser;
      });

      await service.createUser(userData);

      expect(newUser.isPhoneVerified).toBe(false);
    });
  });
});

