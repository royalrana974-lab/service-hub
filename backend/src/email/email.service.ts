/**
 * Email service
 * Handles email sending using nodemailer
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private smtpUser: string;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    this.smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && this.smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: this.smtpUser,
          pass: smtpPass,
        },
      });
      console.log('Nodemailer SMTP service initialized successfully');
    } else {
      console.log('SMTP not configured - emails will not be sent');
    }
  }

  async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<void> {
    if (!this.transporter) {
      console.log(`Password reset email not sent to ${userEmail} - SMTP not configured`);
      return;
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password. Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This email was sent by SERVICEHUB. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM', this.smtpUser),
      to: userEmail,
      subject: 'Password Reset Request - SERVICEHUB',
      html: htmlTemplate,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent successfully to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send password reset email to ${userEmail}:`, error);
      throw error;
    }
  }
}