/**
 * JWT Authentication Strategy
 * Validates JWT tokens and loads user from database
 * Used by JwtAuthGuard to protect routes
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      // Extract JWT from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  /**
   * Validate JWT payload and return user
   * Called after JWT is verified and decoded
   * @param payload - Decoded JWT payload containing user ID
   * @returns User document from database
   */
  async validate(payload: { sub: string; email?: string; phoneNumber?: string }) {
    // Find user by ID from JWT payload
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
