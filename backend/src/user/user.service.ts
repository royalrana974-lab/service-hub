/**
 * User Service
 * Handles user data operations including:
 * - User CRUD operations
 * - Password hashing and verification
 * - User verification status management
 * - Role management
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  /**
   * Find user by phone number
   * @param phoneNumber - Phone number to search for
   * @returns User document or null
   */
  async findByPhone(phoneNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }

  /**
   * Find user by email address
   * @param email - Email address to search for
   * @returns User document or null
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Find user by MongoDB ID
   * @param id - User ID
   * @returns User document or null
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Create a new user
   * Hashes password if provided, sets verification status based on auth method
   * @param data - User data to create
   * @returns Created user document
   */
  async createUser(data: {
    phoneNumber?: string;
    email?: string;
    password?: string;
    authMethod: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  }): Promise<UserDocument> {
    // Hash password if provided (10 rounds)
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    const userData: Partial<User> = {
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: hashedPassword,
      authMethod: data.authMethod as any,
      firstName: data.firstName,
      lastName: data.lastName,
      profilePicture: data.profilePicture,
      // Phone verification: false if phone provided, true otherwise
      isPhoneVerified: data.phoneNumber ? false : true,
      // Email verification: true if email provided without password (OAuth), false otherwise
      isEmailVerified: data.email && !data.password ? true : false,
    };

    const user = new this.userModel(userData);
    return user.save();
  }

  /**
   * Update user information
   * @param id - User ID
   * @param updates - Fields to update
   * @returns Updated user document or null
   */
  async updateUser(id: string, updates: Partial<User>): Promise<UserDocument | null> {
    await this.userModel.findByIdAndUpdate(id, updates).exec();
    return this.findById(id);
  }

  /**
   * Mark user's phone as verified
   * @param id - User ID
   * @returns Updated user document or null
   */
  async verifyPhone(id: string): Promise<UserDocument | null> {
    return this.updateUser(id, { isPhoneVerified: true });
  }

  /**
   * Mark user's email as verified
   * @param id - User ID
   * @returns Updated user document or null
   */
  async verifyEmail(id: string): Promise<UserDocument | null> {
    return this.updateUser(id, { isEmailVerified: true });
  }

  /**
   * Update user's role
   * @param id - User ID
   * @param role - New role (CUSTOMER or PROVIDER)
   * @returns Updated user document or null
   */
  async updateRole(id: string, role: UserRole): Promise<UserDocument | null> {
    return this.updateUser(id, { role });
  }

  /**
   * Compare plain password with hashed password
   * @param user - User document containing hashed password
   * @param password - Plain text password to compare
   * @returns true if passwords match, false otherwise
   */
  async comparePassword(user: UserDocument, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }
}
