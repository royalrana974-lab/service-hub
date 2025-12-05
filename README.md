# SERVICEHUB API

A NestJS-based REST API for SERVICEHUB authentication and user management.

## Features

- **Phone Authentication**: OTP-based phone number verification
- **Email Authentication**: Email/password registration and login
- **Google OAuth**: Social authentication via Google
- **Provider Registration**: Special registration flow for service providers
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Customer and provider role management

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (v4.4 or higher)
- Twilio account (for SMS OTP - optional)
- Google OAuth credentials (for Google login - optional)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (see `.env.example` for reference)

3. Make sure MongoDB is running on your system

4. Run the application:
```bash
npm run start:dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/servicehub

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Twilio (Optional - for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Server
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Phone Authentication

- `POST /auth/phone/send-otp` - Send OTP to phone number
 ```json
 {
"phoneNumber": "+919876543210"
 }
 ```

- `POST /auth/phone/verify-otp` - Verify OTP and login/register
 ```json
 {
"phoneNumber": "+919876543210",
"code": "123456"
 }
 ```

### Email Authentication

- `POST /auth/email/register` - Register with email
 ```json
 {
"email": "user@example.com",
"password": "password123",
"firstName": "John",
"lastName": "Doe"
 }
 ```

- `POST /auth/email/login` - Login with email
 ```json
 {
"email": "user@example.com",
"password": "password123"
 }
 ```

### Google OAuth

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback (handled automatically)

### Provider Registration

- `POST /auth/provider/register` - Register as service provider
 ```json
 {
"email": "provider@example.com",
"password": "password123",
"firstName": "Jane",
"lastName": "Smith",
"phoneNumber": "+919876543210"
 }
 ```

## Response Format

All authentication endpoints return:
```json
{
 "access_token": "jwt-token-here",
 "user": {
"id": "user-uuid",
"email": "user@example.com",
"role": "customer",
...
 }
}
```

## Project Structure

```
src/
├── auth/       # Authentication module
│  ├── dto/     # Data Transfer Objects
│  ├── guards/    # Auth guards
│  ├── strategies/  # Passport strategies
│  ├── auth.controller.ts
│  ├── auth.service.ts
│  └── auth.module.ts
├── user/       # User module
│  ├── schemas/   # Mongoose schemas
│  ├── user.service.ts
│  └── user.module.ts
├── otp/       # OTP module
│  ├── schemas/   # Mongoose schemas
│  ├── otp.service.ts
│  └── otp.module.ts
├── app.module.ts   # Root module
└── main.ts      # Application entry point
```

## Development

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test

# Linting
npm run lint
```

## Notes

- OTP codes are valid for 10 minutes
- JWT tokens expire after 7 days
- Without Twilio credentials, OTP codes will be logged to console
- MongoDB collections are automatically created when first used
- Expired OTPs are automatically cleaned up by MongoDB TTL index

