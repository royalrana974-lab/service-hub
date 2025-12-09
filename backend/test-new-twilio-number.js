/**
 * Test script for new Twilio number: +14259061018
 * This is a Long Code number from Twilio Sender Pool
 */
require('dotenv').config();
const twilio = require('twilio');

// IMPORTANT: Never hardcode secrets! Always use environment variables.
// Add your credentials to .env file:
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('Error: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env file');
  process.exit(1);
}
const fromNumber = '+14259061018'; // Your new Twilio number
const toNumber = process.argv[2] || process.env.TEST_PHONE_NUMBER || '+1234567890'; // Pass as argument or set in .env

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Testing Twilio SMS with New Number');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Configuration:');
console.log(` From Number: ${fromNumber} (Long Code)`);
console.log(` To Number: ${toNumber}`);
console.log(` Account SID: ${accountSid.substring(0, 10)}...\n`);

const client = twilio(accountSid, authToken);

// First, verify the number exists in your account
console.log('1. Verifying phone number in account...');
client.incomingPhoneNumbers
 .list({ phoneNumber: fromNumber })
 .then((numbers) => {
if (numbers.length > 0) {
 const number = numbers[0];
 console.log('Phone number found in account');
 console.log(`  Phone Number: ${number.phoneNumber}`);
 console.log(`  Friendly Name: ${number.friendlyName || 'N/A'}`);
 console.log(`  Status: ${number.status}`);
 console.log(`  Capabilities:`);

 console.log('');
 
 if (!number.capabilities.sms) {
  console.log(' WARNING: This number does not support SMS!');
  process.exit(1);
 }
} else {
 console.log('Phone number not found in account');
 console.log('  It might be part of a Messaging Service');
 console.log('');
}

// Send test SMS
console.log('2. Sending test SMS...');
return client.messages.create({
 body: 'Test SMS from SERVICEHUB - Your verification code is: 123456',
 from: fromNumber,
 to: toNumber,
});
 })
 .then((message) => {
console.log('SMS sent successfully!');
console.log('');
console.log('Message Details:');
console.log(`  Message SID: ${message.sid}`);
console.log(`  Status: ${message.status}`);
console.log(`  From: ${message.from}`);
console.log(`  To: ${message.to}`);
console.log(`  Body: ${message.body}`);
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Test completed successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Update .env file: TWILIO_PHONE_NUMBER=+14259061018');
console.log('2. Restart your server');
console.log('3. Test OTP endpoint: POST /auth/phone/send-otp');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
 })
 .catch((error) => {
console.log('Error occurred:');
console.log('');
console.log(`  Error Code: ${error.code}`);
console.log(`  Error Message: ${error.message}`);
if (error.moreInfo) {
 console.log(`  More Info: ${error.moreInfo}`);
}
console.log('');

// Common error codes
const errorMessages = {
 20003: 'Authentication failed - check Account SID and Auth Token',
 21211: 'Invalid phone number format',
 21608: 'Phone number not verified (Trial account restriction)',
 21610: 'Unsubscribed recipient',
 21614: 'Invalid "To" phone number',
 30003: 'Unreachable destination handset',
 30004: 'Message blocked',
 30005: 'Unknown destination handset',
 30006: 'Landline or unreachable carrier',
};

if (errorMessages[error.code]) {
 console.log(`Solution: ${errorMessages[error.code]}`);
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Test failed. Please check the errors above.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
process.exit(1);
 });

