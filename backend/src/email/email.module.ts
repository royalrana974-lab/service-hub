/**
 * Email module
 * Provides email sending services using nodemailer
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService], // Export EmailService for use in other modules
})
export class EmailModule {}