/**
 * Test script for new Twilio number: +14259061018
 * This is a Long Code number from Twilio Sender Pool
 */
require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = '+14259061018'; // Your new Twilio number
const toNumber = process.argv[2] || process.env.TEST_PHONE_NUMBER || '+1234567890'; // Pass as argument or set in .env

if (!accountSid || !authToken) {
  console.error('ERROR: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env file');
  process.exit(1);
}

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
      console.log(`   ✓ Number found: ${number.friendlyName || number.phoneNumber}`);
      console.log(`   Capabilities: ${JSON.stringify(number.capabilities)}\n`);
    } else {
      console.log(`   ⚠ Number ${fromNumber} not found in account\n`);
    }

    // Test sending SMS
    console.log('2. Sending test SMS...');
    return client.messages.create({
      body: 'Test message from ServiceHub - Twilio integration test',
      from: fromNumber,
      to: toNumber,
    });
  })
  .then((message) => {
    console.log(`   ✓ SMS sent successfully!`);
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   Status: ${message.status}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  })
  .catch((error) => {
    console.error('\n❌ Error occurred:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}\n`);

    if (error.code === 21608) {
      console.error('   This is a Trial account restriction.');
      console.error('   Verify the recipient number in Twilio Console:');
      console.error('   https://console.twilio.com/us1/develop/phone-numbers/manage/verified\n');
    } else if (error.code === 21659) {
      console.error('   Invalid sender number.');
      console.error('   Check TWILIO_PHONE_NUMBER in .env file.\n');
    } else if (error.code === 21266) {
      console.error('   Sender and recipient cannot be the same number.\n');
    }

    process.exit(1);
  });
