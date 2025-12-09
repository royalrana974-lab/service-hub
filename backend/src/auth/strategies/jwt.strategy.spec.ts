/**
 * Unit tests for JWT Strategy
 * Tests JWT token validation and user loading
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockUserService = {
    findById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') {
        return 'test-secret-key';
      }
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate JWT payload and return user (with sub)', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
      };
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
      expect(mockUserService.findById).toHaveBeenCalledTimes(1);
    });

    it('should validate JWT payload with email', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
      };
      const mockUser = {
        id: '123',
        email: 'test@example.com',
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });

    it('should validate JWT payload with phoneNumber', async () => {
      const payload = {
        sub: '123',
        phoneNumber: '+1234567890',
      };
      const mockUser = {
        id: '123',
        phoneNumber: '+1234567890',
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
      };

      mockUserService.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findById).toHaveBeenCalledWith('123');
    });

    it('should handle service errors', async () => {
      const payload = {
        sub: '123',
        email: 'test@example.com',
      };
      const error = new Error('Database error');

      mockUserService.findById.mockRejectedValue(error);

      await expect(strategy.validate(payload)).rejects.toThrow('Database error');
    });
  });

  describe('constructor', () => {
    it('should use default secret when JWT_SECRET not configured', () => {
      const mockConfigWithoutSecret = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const strategyWithDefault = new JwtStrategy(
        mockConfigWithoutSecret as any,
        mockUserService as any,
      );

      expect(strategyWithDefault).toBeDefined();
    });
  });
});
