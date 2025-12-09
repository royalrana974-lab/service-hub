#!/bin/bash

BASE_URL="${1:-http://localhost:3000}"

echo "=== Testing Email Registration Validation ==="
echo ""

echo "Test 1: Missing fullName"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' | jq '.'
echo ""

echo "Test 2: Invalid email format"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "invalid-email",
    "password": "password123",
    "confirmPassword": "password123"
  }' | jq '.'
echo ""

echo "Test 3: Password too short"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "test@example.com",
    "password": "12345",
    "confirmPassword": "12345"
  }' | jq '.'
echo ""

echo "Test 4: Passwords don't match"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password456"
  }' | jq '.'
echo ""

echo "Test 5: Full name too short"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "J",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' | jq '.'
echo ""

echo "Test 6: Full name with invalid characters"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John123 Doe",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' | jq '.'
echo ""

echo "Test 7: Valid registration"
curl -s -X POST "$BASE_URL/auth/email/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' | jq '.'
echo ""

echo "=== Testing Email Login Validation ==="
echo ""

echo "Test 8: Missing email"
curl -s -X POST "$BASE_URL/auth/email/login" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "password123"
  }' | jq '.'
echo ""

echo "Test 9: Invalid email format"
curl -s -X POST "$BASE_URL/auth/email/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }' | jq '.'
echo ""

echo "Test 10: Missing password"
curl -s -X POST "$BASE_URL/auth/email/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }' | jq '.'
echo ""
