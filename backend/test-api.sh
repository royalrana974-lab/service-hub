#!/bin/bash

# Quick API Test Script for SERVICEHUB
# This script tests all API endpoints

BASE_URL="${1:-http://localhost:3001}"
echo "Testing SERVICEHUB API at: $BASE_URL"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Send OTP
echo -e "${YELLOW}Test 1: Send OTP${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/phone/send-otp" \
 -H "Content-Type: application/json" \
 -d '{"phoneNumber": "+919876543210"}')
echo "Response: $RESPONSE"
echo ""

# Test 2: Email Register
echo -e "${YELLOW}Test 2: Email Register${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/email/register" \
 -H "Content-Type: application/json" \
 -d '{
"email": "test'$(date +%s)'@example.com",
"password": "password123",
"firstName": "Test",
"lastName": "User"
 }')
echo "Response: $REGISTER_RESPONSE"

# Extract access token
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$ACCESS_TOKEN" ]; then
 echo -e "${GREEN}✓ Access token received${NC}"
 echo "Token: ${ACCESS_TOKEN:0:50}..."
 
 # Test 3: Get Profile
 echo ""
 echo -e "${YELLOW}Test 3: Get User Profile${NC}"
 PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/user/profile" \
-H "Authorization: Bearer $ACCESS_TOKEN")
 echo "Response: $PROFILE_RESPONSE"
 
 if echo "$PROFILE_RESPONSE" | grep -q "email"; then
echo -e "${GREEN}✓ Profile retrieved successfully${NC}"
 else
echo -e "${RED}✗ Failed to retrieve profile${NC}"
 fi
else
 echo -e "${RED}✗ Failed to get access token${NC}"
fi

echo ""
echo -e "${YELLOW}Test 4: Email Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/email/login" \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "password123"
 }')
echo "Response: $LOGIN_RESPONSE"
echo ""

echo -e "${YELLOW}Test 5: Provider Register${NC}"
PROVIDER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/provider/register" \
 -H "Content-Type: application/json" \
 -d '{
"email": "provider'$(date +%s)'@example.com",
"password": "password123",
"firstName": "Provider",
"lastName": "User",
"phoneNumber": "+919876543210"
 }')
echo "Response: $PROVIDER_RESPONSE"
echo ""

echo "======================================"
echo "Testing complete!"
echo ""
echo "To test in Postman:"
echo "1. Import SERVICEHUB_API.postman_collection.json"
echo "2. Set base_url variable to: $BASE_URL"
echo "3. Run requests from the collection"

