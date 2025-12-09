/**
 * Unit tests for User Controller
 * Tests user profile endpoint
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile without password (using id)', async () => {
      const mockUser = {
        id: '123',
        _id: '123',
        phoneNumber: '+1234567890',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({
          id: '123',
          phoneNumber: '+1234567890',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'hashedPassword',
        }),
      };

      const mockRequest = {
        user: {
          id: '123',
        },
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('phoneNumber', '+1234567890');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
      expect(mockUserService.findById).toHaveBeenCalledTimes(1);
    });

    it('should return user profile without password (using _id)', async () => {
      const mockUser = {
        _id: '123',
        phoneNumber: '+1234567890',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          phoneNumber: '+1234567890',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'hashedPassword',
        }),
      };

      const mockRequest = {
        user: {
          _id: '123',
        },
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('phoneNumber', '+1234567890');
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });

    it('should return user profile when user is plain object', async () => {
      const mockUser = {
        id: '123',
        phoneNumber: '+1234567890',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashedPassword',
      };

      const mockRequest = {
        user: {
          id: '123',
        },
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('phoneNumber', '+1234567890');
      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('should throw error when user not found', async () => {
      const mockRequest = {
        user: {
          id: '123',
        },
      };

      mockUserService.findById.mockResolvedValue(null);

      await expect(controller.getProfile(mockRequest)).rejects.toThrow('User not found');
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });

    it('should handle service errors', async () => {
      const mockRequest = {
        user: {
          id: '123',
        },
      };
      const error = new Error('Database error');

      mockUserService.findById.mockRejectedValue(error);

      await expect(controller.getProfile(mockRequest)).rejects.toThrow('Database error');
    });
  });
});
