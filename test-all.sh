#!/bin/bash

# Comprehensive test script for all implemented features
# Usage: ./test-all.sh

set -e # Exit on error

echo " Starting comprehensive tests..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to print test result
print_result() {
if [ $? -eq 0 ]; then
  echo -e "${GREEN}$1${NC}"
  ((PASSED++))
else
  echo -e "${RED}$1${NC}"
  ((FAILED++))
fi
}

# 1. Test Husky + ESLint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Testing Husky + ESLint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Checking ESLint configuration..."
npm run lint:check > /dev/null 2>&1
print_result "ESLint check passed"

echo "Checking Prettier formatting..."
npm run format > /dev/null 2>&1
print_result "Prettier formatting passed"

echo "Checking Husky hook exists..."
if [ -f ".husky/pre-commit" ] && [ -x ".husky/pre-commit" ]; then
print_result "Husky pre-commit hook exists and is executable"
else
echo -e "${RED}Husky pre-commit hook missing or not executable${NC}"
((FAILED++))
fi

echo ""

# 2. Test Unit Tests + Coverage
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Testing Unit Tests + Coverage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Running unit tests..."
npm test -- --passWithNoTests > /dev/null 2>&1
print_result "Unit tests passed"

echo "Checking test coverage..."
COVERAGE_OUTPUT=$(npm run test:cov 2>&1)
if echo "$COVERAGE_OUTPUT" | grep -q "Test Suites:.*passed"; then
print_result "Test coverage check passed"

# Extract coverage percentages
echo ""
echo -e "${YELLOW}Coverage Summary:${NC}"
echo "$COVERAGE_OUTPUT" | grep -A 5 "File.*Stmts.*Branch.*Funcs.*Lines" | head -10
else
echo -e "${RED}Test coverage check failed${NC}"
((FAILED++))
fi

echo ""

# 3. Test Docker
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Testing Docker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
print_result "Docker is installed"

echo "Checking Docker is running..."
if docker ps &> /dev/null; then
  print_result "Docker daemon is running"
  
  echo "Building Docker image..."
  docker build -t service-hub-api-test . > /dev/null 2>&1
  print_result "Docker image built successfully"
  
  echo "Cleaning up test image..."
  docker rmi service-hub-api-test > /dev/null 2>&1 || true
  print_result "Docker cleanup completed"
else
  echo -e "${YELLOW} Docker daemon is not running. Skipping Docker tests.${NC}"
fi
else
echo -e "${YELLOW} Docker is not installed. Skipping Docker tests.${NC}"
fi

echo ""

# 4. Test Socket.io (if implemented)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Testing Socket.io"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "@nestjs/websockets\|socket.io" package.json 2>/dev/null; then
echo "Socket.io dependencies found..."
# Add Socket.io tests here when implemented
echo -e "${YELLOW} Socket.io tests not yet implemented${NC}"
else
echo -e "${YELLOW} Socket.io not yet implemented${NC}"
fi

echo ""

# 5. Test Firebase/FCM (if implemented)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Testing Firebase/FCM"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -q "firebase-admin\|firebase" package.json 2>/dev/null; then
echo "Firebase dependencies found..."
# Add Firebase tests here when implemented
echo -e "${YELLOW} Firebase/FCM tests not yet implemented${NC}"
else
echo -e "${YELLOW} Firebase/FCM not yet implemented${NC}"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
echo -e "${GREEN}All tests passed!${NC}"
exit 0
else
echo -e "${RED}Some tests failed. Please review the output above.${NC}"
exit 1
fi

