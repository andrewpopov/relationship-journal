#!/bin/bash

# Deployment script for Relationship Journal on Raspberry Pi
# Run this script with: bash deploy/deploy.sh

set -e

echo "=== Relationship Journal Deployment Script ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Raspberry Pi
if [ ! -f /proc/device-tree/model ] || ! grep -q "Raspberry Pi" /proc/device-tree/model 2>/dev/null; then
    echo -e "${YELLOW}Warning: This doesn't appear to be a Raspberry Pi${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set project directory
PROJECT_DIR="/home/pi/relationship-journal"

echo -e "${GREEN}Step 1: Updating system packages...${NC}"
sudo apt update

echo -e "${GREEN}Step 2: Installing Node.js (if not installed)...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

echo -e "${GREEN}Step 3: Installing nginx (if not installed)...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
else
    echo "nginx already installed"
fi

echo -e "${GREEN}Step 4: Setting up backend...${NC}"
cd "$PROJECT_DIR/backend"
npm install --production

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${RED}IMPORTANT: Edit backend/.env and set a secure JWT_SECRET${NC}"
fi

echo -e "${GREEN}Step 5: Building frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm install
npm run build

echo -e "${GREEN}Step 6: Setting up systemd service...${NC}"
sudo cp "$PROJECT_DIR/deploy/relationship-journal-backend.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable relationship-journal-backend
sudo systemctl restart relationship-journal-backend

echo -e "${GREEN}Step 7: Configuring nginx...${NC}"
sudo cp "$PROJECT_DIR/deploy/nginx.conf" /etc/nginx/sites-available/relationship-journal

if [ ! -L /etc/nginx/sites-enabled/relationship-journal ]; then
    sudo ln -s /etc/nginx/sites-available/relationship-journal /etc/nginx/sites-enabled/
fi

sudo nginx -t
sudo systemctl restart nginx

echo -e "${GREEN}Step 8: Creating uploads directory...${NC}"
mkdir -p "$PROJECT_DIR/backend/uploads"

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo "Backend service status:"
sudo systemctl status relationship-journal-backend --no-pager
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and set a secure JWT_SECRET"
echo "2. Setup cloudflared tunnel (see README.md)"
echo "3. Test the application at http://localhost"
echo ""
echo "Useful commands:"
echo "  - Check backend logs: journalctl -u relationship-journal-backend -f"
echo "  - Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "  - Restart backend: sudo systemctl restart relationship-journal-backend"
echo "  - Restart nginx: sudo systemctl restart nginx"
