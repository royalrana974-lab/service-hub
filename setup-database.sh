#!/bin/bash

# SERVICEHUB Database Setup Script
# This script helps set up the PostgreSQL database for SERVICEHUB

echo "SERVICEHUB Database Setup"
echo "========================"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
echo "ERROR: PostgreSQL is not running or not accessible"
echo "Please start PostgreSQL first: sudo systemctl start postgresql"
exit 1
fi

echo "PostgreSQL is running"
echo ""

# Try to connect and create database
echo "Attempting to create database 'servicehub'..."
echo ""

# Method 1: Try with postgres user and common passwords
PASSWORDS=("postgres" "" "admin" "root")

for PASSWORD in "${PASSWORDS[@]}"; do
if [ -z "$PASSWORD" ]; then
  echo "Trying connection without password (peer authentication)..."
  export PGPASSWORD=""
  if psql -U postgres -h localhost -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Connected successfully!"
    psql -U postgres -h localhost -c "CREATE DATABASE servicehub;" 2>&1
    if [ $? -eq 0 ]; then
      echo "✓ Database 'servicehub' created successfully!"
      echo ""
      echo "Update your .env file with:"
      echo "DB_PASSWORD="
      exit 0
    fi
  fi
else
  echo "Trying password: $PASSWORD"
  export PGPASSWORD="$PASSWORD"
  if psql -U postgres -h localhost -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Connected successfully with password!"
    psql -U postgres -h localhost -c "CREATE DATABASE servicehub;" 2>&1
    if [ $? -eq 0 ]; then
      echo "✓ Database 'servicehub' created successfully!"
      echo ""
      echo "Update your .env file with:"
      echo "DB_PASSWORD=$PASSWORD"
      exit 0
    fi
  fi
fi
done

echo ""
echo "Could not connect to PostgreSQL automatically."
echo ""
echo "Please run the following commands manually:"
echo ""
echo "1. Connect to PostgreSQL:"
echo "  sudo -u postgres psql"
echo ""
echo "2. Create the database:"
echo "  CREATE DATABASE servicehub;"
echo ""
echo "3. (Optional) Create a user with password:"
echo "  CREATE USER servicehub_user WITH PASSWORD 'your_password';"
echo "  GRANT ALL PRIVILEGES ON DATABASE servicehub TO servicehub_user;"
echo ""
echo "4. Update your .env file with the correct credentials"
echo ""

