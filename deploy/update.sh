#!/bin/bash

# Update script for Relationship Journal
# Run this script to update the application after pulling new changes

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/home/pi/relationship-journal"

echo -e "${BLUE}=== Updating Relationship Journal ===${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory not found at $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

echo -e "${GREEN}Step 1: Pulling latest changes from git...${NC}"
git pull

echo -e "${GREEN}Step 2: Updating backend dependencies...${NC}"
cd backend
npm install --production

echo -e "${GREEN}Step 3: Rebuilding frontend...${NC}"
cd ../frontend
npm install
npm run build

echo -e "${GREEN}Step 4: Restarting backend service...${NC}"
sudo systemctl restart relationship-journal-backend

echo -e "${GREEN}Step 5: Restarting nginx...${NC}"
sudo systemctl restart nginx

echo ""
echo -e "${GREEN}=== Update Complete! ===${NC}"
echo ""
echo "Service status:"
sudo systemctl status relationship-journal-backend --no-pager | head -5
echo ""
echo -e "${YELLOW}If you encounter any issues:${NC}"
echo "  - Check backend logs: journalctl -u relationship-journal-backend -f"
echo "  - Check nginx logs: sudo tail -f /var/log/nginx/error.log"
