/**
 * Unit tests for User Service (Part 2)
 * Tests user update operations and password verification
 */
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserDocument, UserRole } from './schemas/user.schema';
import {
  createUserTestModule,
  mockUserModel,
  mockUser,
  resetUserMocks,
} from './user.service.test-setup';

jest.mock('bcrypt');

describe('UserService (Part 2)', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await createUserTestModule();
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    resetUserMocks();
  });

  describe('updateUser', () => {
    it('should update user and return updated user', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updates = { firstName: 'John' };
      const updatedUser = { ...mockUser, ...updates };

      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateUser(id, updates);

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updates);
    });
  });

  describe('verifyPhone', () => {
    it('should mark phone as verified', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updatedUser = { ...mockUser, isPhoneVerified: true };

      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.verifyPhone(id);

      expect(result?.isPhoneVerified).toBe(true);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(id, {
        isPhoneVerified: true,
      });
    });
  });

  describe('verifyEmail', () => {
    it('should mark email as verified', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updatedUser = { ...mockUser, isEmailVerified: true };

      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.verifyEmail(id);

      expect(result?.isEmailVerified).toBe(true);
    });
  });

  describe('updateRole', () => {
    it('should update user role', async () => {
      const id = '507f1f77bcf86cd799439011';
      const role = UserRole.PROVIDER;
      const updatedUser = { ...mockUser, role };

      mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });
      mockUserModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateRole(id, role);

      expect(result?.role).toBe(UserRole.PROVIDER);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.comparePassword(mockUser as unknown as UserDocument, password);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return false for non-matching password', async () => {
      const password = 'wrongpassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.comparePassword(mockUser as unknown as UserDocument, password);

      expect(result).toBe(false);
    });

    it('should return false if user has no password', async () => {
      const userWithoutPassword = { ...mockUser, password: undefined };
      const password = 'password123';

      const result = await service.comparePassword(
        userWithoutPassword as unknown as UserDocument,
        password,
      );

      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});

