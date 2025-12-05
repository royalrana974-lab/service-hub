/**
 * OTP Service
 * Handles OTP generation, verification, and management
 * Generates 6-digit codes, validates them, and marks as used
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
  ) {}

  /**
   * Generate a random 6-digit OTP code
   * @returns 6-digit string code (100000-999999)
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and store a new OTP code
   * Generates code, sets expiration (10 minutes), and saves to database
   * @param identifier - Phone number or email to associate OTP with
   * @returns The generated OTP code
   */
  async createOtp(identifier: string): Promise<string> {
    const code = this.generateOtpCode();
    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Create and save OTP document
    const otp = new this.otpModel({
      identifier,
      code,
      expiresAt,
      isUsed: false,
    });

    await otp.save();
    return code;
  }

  /**
   * Verify OTP code for an identifier
   * Checks if code exists, is not used, and not expired
   * Marks OTP as used after successful verification
   * @param identifier - Phone number or email
   * @param code - OTP code to verify
   * @returns true if valid, false otherwise
   */
  async verifyOtp(identifier: string, code: string): Promise<boolean> {
    // Find unused OTP matching identifier and code
    const otp = await this.otpModel
      .findOne({
        identifier,
        code,
        isUsed: false,
      })
      .exec();

    if (!otp) {
      return false;
    }

    // Check if OTP has expired
    if (new Date() > otp.expiresAt) {
      return false;
    }

    // Mark OTP as used to prevent reuse
    otp.isUsed = true;
    await otp.save();
    return true;
  }

  /**
   * Get the latest active OTP for an identifier (for testing)
   * Retrieves most recent unused, non-expired OTP
   * @param identifier - Phone number or email
   * @returns OTP code or null if none found
   */
  async getLatestOtp(identifier: string): Promise<string | null> {
    const otp = await this.otpModel
      .findOne({
        identifier,
        isUsed: false,
        expiresAt: { $gt: new Date() }, // Not expired
      })
      .sort({ createdAt: -1 }) // Get most recent first
      .exec();

    return otp?.code || null;
  }

  /**
   * Clean up expired OTPs from database
   * Removes all OTPs that have passed their expiration date
   */
  async cleanupExpiredOtps(): Promise<void> {
    await this.otpModel
      .deleteMany({
        expiresAt: { $lt: new Date() },
      })
      .exec();
  }
}
