/**
 * JWT Authentication Guard
 * Protects routes by validating JWT tokens from Authorization header
 * Extends Passport's JWT strategy guard
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
