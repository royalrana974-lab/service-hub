/**
 * User Controller
 * Handles user-related endpoints
 * Currently provides profile retrieval endpoint
 */
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get current user's profile
   * GET /user/profile
   * Requires JWT authentication
   * Returns user data excluding password
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    // Get user ID from JWT payload (handles both id and _id formats)
    const user = await this.userService.findById(req.user.id || req.user._id);
    if (!user) {
      throw new Error('User not found');
    }

    // Convert Mongoose document to plain object if needed
    const userObj = user.toObject ? user.toObject() : user;
    // Remove password from response for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }
}
