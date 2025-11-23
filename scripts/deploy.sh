#!/bin/bash
set -e

echo "================================"
echo "Deploying Relationship Journal"
echo "================================"

# Navigate to project directory
cd /home/admin/proj/relationship-journal

echo "1. Pulling latest code from GitHub..."
git pull origin master

echo "2. Installing backend dependencies..."
cd backend
npm ci --only=production
cd ..

echo "3. Installing frontend dependencies..."
cd frontend
npm ci
cd ..

echo "4. Building frontend..."
cd frontend
npm run build
cd ..

echo "5. Setting up backend environment..."
# Copy .env.production to backend/.env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Warning: backend/.env not found. Please create it manually."
else
    echo "backend/.env exists."
fi

echo "6. Restarting PM2 services..."
pm2 restart relationship-journal-app
pm2 restart relationship-journal-tunnel

echo "7. Checking PM2 status..."
pm2 status

echo "================================"
echo "Deployment complete!"
echo "================================"
echo ""
echo "Check logs with:"
echo "  pm2 logs relationship-journal-app"
echo "  pm2 logs relationship-journal-tunnel"
