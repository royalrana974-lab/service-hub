#!/bin/bash

# ServiceHub Quick Start Script

echo " ServiceHub - Quick Start Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
echo "Node.js is not installed. Please install Node.js v18 or higher."
exit 1
fi

echo "Node.js version: $(node --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
echo " Creating .env file from .env.example..."
cp .env.example .env
echo " Please update .env file with your configuration!"
echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
echo " Installing dependencies..."
npm install
echo ""
fi

# Ask user which option they want
echo "Choose an option:"
echo "1) Run with Docker (recommended)"
echo "2) Run locally (requires PostgreSQL)"
echo "3) Run tests"
echo "4) Setup database only"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
1)
  echo ""
  echo " Starting services with Docker..."
  if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose is not installed."
    exit 1
  fi
  docker-compose up -d
  echo ""
  echo "Services started!"
  echo " API: http://localhost:3000/api/v1"
  echo " PostgreSQL: localhost:5432"
  echo " Redis: localhost:6379"
  echo " pgAdmin: http://localhost:5050"
  echo ""
  echo "View logs: docker-compose logs -f app"
  ;;
2)
  echo ""
  echo " Starting development server..."
  echo " Make sure PostgreSQL is running!"
  echo ""
  npm run start:dev
  ;;
3)
  echo ""
  echo " Running tests..."
  npm run test
  echo ""
  echo " Running tests with coverage..."
  npm run test:cov
  ;;
4)
  echo ""
  echo " Starting PostgreSQL with Docker..."
  docker-compose up -d postgres
  echo ""
  echo "PostgreSQL started on localhost:5432"
  echo "Database: servicehub"
  echo "Username: postgres"
  echo "Password: postgres"
  ;;
*)
  echo "Invalid choice. Exiting."
  exit 1
  ;;
esac

echo ""
echo " Done!"
