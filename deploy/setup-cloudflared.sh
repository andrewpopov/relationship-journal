#!/bin/bash

# Cloudflared Tunnel Setup Script for Raspberry Pi
# This script helps set up a Cloudflare Tunnel for the Relationship Journal

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Cloudflare Tunnel Setup ===${NC}"
echo ""

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}cloudflared not found. Installing...${NC}"

    # Detect architecture
    ARCH=$(uname -m)
    if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
        PACKAGE="cloudflared-linux-arm64.deb"
    elif [ "$ARCH" = "armv7l" ]; then
        PACKAGE="cloudflared-linux-arm.deb"
    else
        PACKAGE="cloudflared-linux-amd64.deb"
    fi

    echo "Downloading cloudflared for $ARCH..."
    wget https://github.com/cloudflare/cloudflared/releases/latest/download/$PACKAGE
    sudo dpkg -i $PACKAGE
    rm $PACKAGE

    echo -e "${GREEN}cloudflared installed successfully${NC}"
else
    echo -e "${GREEN}cloudflared already installed: $(cloudflared --version)${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Authenticate with Cloudflare${NC}"
echo "This will open a browser window. Log in to your Cloudflare account."
read -p "Press Enter to continue..."
cloudflared tunnel login

echo ""
echo -e "${BLUE}Step 2: Create a tunnel${NC}"
read -p "Enter a name for your tunnel (e.g., relationship-journal): " TUNNEL_NAME
TUNNEL_NAME=${TUNNEL_NAME:-relationship-journal}

cloudflared tunnel create $TUNNEL_NAME

# Get the tunnel ID
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')

if [ -z "$TUNNEL_ID" ]; then
    echo -e "${RED}Failed to get tunnel ID. Please check the output above.${NC}"
    exit 1
fi

echo -e "${GREEN}Tunnel created successfully!${NC}"
echo "Tunnel ID: $TUNNEL_ID"

echo ""
echo -e "${BLUE}Step 3: Configure the tunnel${NC}"

# Create config directory
sudo mkdir -p /etc/cloudflared

# Create config file
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: $TUNNEL_ID
credentials-file: /home/pi/.cloudflared/$TUNNEL_ID.json

ingress:
  # Route all traffic to nginx
  - service: http://localhost:80

# Logging
loglevel: info
EOF

echo -e "${GREEN}Config file created at /etc/cloudflared/config.yml${NC}"

echo ""
echo -e "${BLUE}Step 4: Set up DNS${NC}"
echo ""
echo -e "${YELLOW}You need to configure DNS in your Cloudflare dashboard:${NC}"
echo ""
echo "1. Go to https://dash.cloudflare.com"
echo "2. Select your domain"
echo "3. Go to DNS settings"
echo "4. Run the following command to route your domain:"
echo ""
echo -e "${GREEN}cloudflared tunnel route dns $TUNNEL_NAME your-subdomain.your-domain.com${NC}"
echo ""
read -p "Enter your desired hostname (e.g., journal.example.com): " HOSTNAME

if [ ! -z "$HOSTNAME" ]; then
    echo "Running: cloudflared tunnel route dns $TUNNEL_NAME $HOSTNAME"
    cloudflared tunnel route dns $TUNNEL_NAME $HOSTNAME
    echo -e "${GREEN}DNS route created!${NC}"
fi

echo ""
echo -e "${BLUE}Step 5: Install and start the service${NC}"
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "Your tunnel is now running and will start automatically on boot."
echo ""
echo "Tunnel details:"
echo "  Name: $TUNNEL_NAME"
echo "  ID: $TUNNEL_ID"
echo "  Hostname: ${HOSTNAME:-Not configured}"
echo ""
echo "Useful commands:"
echo "  - Check status: sudo systemctl status cloudflared"
echo "  - View logs: sudo journalctl -u cloudflared -f"
echo "  - Restart: sudo systemctl restart cloudflared"
echo "  - List tunnels: cloudflared tunnel list"
echo ""
echo "Your Relationship Journal should now be accessible at: https://$HOSTNAME"
