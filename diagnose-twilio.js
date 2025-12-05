/**
 * Twilio SMS Diagnostic Script
 * Helps identify why SMS is failing
 */
require('dotenv').config();
const twilio = require('twilio');

console.log('Twilio SMS Diagnostic Tool\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log('1. Environment Variables Check:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!accountSid) {
 console.log('TWILIO_ACCOUNT_SID: NOT SET');
} else {
 const isValid = accountSid.startsWith('AC') && accountSid.length >= 32;
 console.log(`TWILIO_ACCOUNT_SID: ${accountSid.substring(0, 10)}...${isValid ? ' (Valid format)' : ' (Invalid format - should start with AC)'}`);
}

if (!authToken) {
 console.log('TWILIO_AUTH_TOKEN: NOT SET');
} else {
 const isValid = authToken.length === 32;
 console.log(`TWILIO_AUTH_TOKEN: ${authToken.substring(0, 10)}...${isValid ? ' (Valid length)' : ' (Invalid length - should be 32 chars)'}`);
}

if (!phoneNumber) {
 console.log('TWILIO_PHONE_NUMBER: NOT SET');
} else {
 const isValid = phoneNumber.startsWith('+') && /^\+[1-9]\d{1,14}$/.test(phoneNumber);
 console.log(`TWILIO_PHONE_NUMBER: ${phoneNumber}${isValid ? ' (Valid E.164 format)' : ' (Invalid format - should be +1234567890)'}`);
}

console.log('\n2. Twilio Client Initialization:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!accountSid || !authToken) {
 console.log('Cannot initialize Twilio client - missing credentials');
 process.exit(1);
}

let client;
try {
 client = twilio(accountSid, authToken);
 console.log('Twilio client initialized successfully');
} catch (error) {
 console.log(`Failed to initialize Twilio client: ${error.message}`);
 process.exit(1);
}

console.log('\n3. Account Verification:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

client.api.accounts(accountSid)
 .fetch()
 .then((account) => {
console.log(`Account Status: ${account.status}`);
console.log(`  Account Name: ${account.friendlyName}`);
console.log(`  Account Type: ${account.type}`);

if (account.status === 'suspended') {
 console.log(' WARNING: Account is suspended!');
}

return client.api.balance.fetch();
 })
 .then((balance) => {
console.log(`Account Balance: ${balance.balance} ${balance.currency}`);

if (parseFloat(balance.balance) <= 0) {
 console.log(' WARNING: Low or zero balance! SMS may fail.');
}

console.log('\n4. Phone Number Verification:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!phoneNumber) {
 console.log('TWILIO_PHONE_NUMBER not set - cannot verify');
 return;
}

return client.incomingPhoneNumbers.list({ phoneNumber });
 })
 .then((numbers) => {
if (numbers && numbers.length > 0) {
 const number = numbers[0];
 console.log(`Phone Number Found: ${number.phoneNumber}`);
 console.log(`  Status: ${number.status}`);
 console.log(`  Capabilities: SMS=${number.capabilities.sms}, Voice=${number.capabilities.voice}`);
} else {
 console.log(` Phone number ${phoneNumber} not found in your Twilio account`);
 console.log('  This might be a verified number (Trial account)');
}

console.log('\n5. Test SMS Send:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Testing SMS send (using a test number)...');

// Use a test number or the configured number
const testToNumber = process.argv[2] || phoneNumber;

if (!testToNumber) {
 console.log(' No test number provided. Skipping SMS test.');
 console.log('  Usage: node diagnose-twilio.js +1234567890');
 return;
}

return client.messages.create({
 body: 'Test SMS from SERVICEHUB Diagnostic Tool',
 from: phoneNumber,
 to: testToNumber,
});
 })
 .then((message) => {
console.log('SMS sent successfully!');
console.log(`  Message SID: ${message.sid}`);
console.log(`  Status: ${message.status}`);
console.log(`  To: ${message.to}`);
console.log(`  From: ${message.from}`);
console.log('\nAll checks passed! Twilio is configured correctly.');
 })
 .catch((error) => {
console.log('SMS Send Failed:');
console.log(`  Error Code: ${error.code}`);
console.log(`  Error Message: ${error.message}`);
console.log(`  More Info: ${error.moreInfo || 'N/A'}`);

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
 console.log(`\nSolution: ${errorMessages[error.code]}`);
}

console.log('\nTwilio configuration has issues. Please fix the errors above.');
process.exit(1);
 });

