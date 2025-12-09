/**
 * Root application module
 * Configures global modules (Config, MongoDB) and imports feature modules
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    // Global configuration module - makes ConfigService available throughout the app
    // Reads environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB connection module - connects to MongoDB using async configuration
    // Uses MONGODB_URI from environment or defaults to local MongoDB instance
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/servicehub',
      }),
      inject: [ConfigService],
    }),
    // Feature modules
    AuthModule, // Handles authentication (phone OTP, email)
    UserModule, // Manages user data and profiles
    OtpModule, // Handles OTP generation and verification
    ServicesModule, // Manages service catalogue
  ],
})
export class AppModule {}
