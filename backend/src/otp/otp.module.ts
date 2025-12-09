/**
 * OTP Module
 * Provides OTP generation and verification services
 * Registers OTP schema with Mongoose
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpService } from './otp.service';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpService],
  exports: [OtpService], // Export OtpService for use in other modules (e.g., AuthModule)
})
export class OtpModule {}
