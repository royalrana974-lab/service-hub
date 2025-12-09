#!/bin/bash

BASE_URL="${1:-http://localhost:3000}"

echo "=== Testing Email Registration ==="
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }')

echo "$REGISTER_RESPONSE"
echo ""

# Extract access token
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$ACCESS_TOKEN" ]; then
  echo "=== Registration Successful ==="
  echo "Access Token: ${ACCESS_TOKEN:0:50}..."
  echo ""
  
  # Extract email from response for login test
  EMAIL=$(echo $REGISTER_RESPONSE | grep -o '"email":"[^"]*' | cut -d'"' -f4)
  
  echo "=== Testing Email Login ==="
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/email/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$EMAIL\",
      \"password\": \"password123\"
    }")
  
  echo "$LOGIN_RESPONSE"
  echo ""
  
  # Extract access token from login
  LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ ! -z "$LOGIN_TOKEN" ]; then
    echo "=== Login Successful ==="
    echo "Access Token: ${LOGIN_TOKEN:0:50}..."
    echo ""
    
    echo "=== Testing Protected Endpoint (User Profile) ==="
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/user/profile" \
      -H "Authorization: Bearer $LOGIN_TOKEN")
    
    echo "$PROFILE_RESPONSE"
  else
    echo "Login failed"
  fi
else
  echo "Registration failed"
fi
