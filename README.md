# Relationship Journal

A web application for couples to strengthen their relationship through journaling, sharing memories, expressing gratitude, and setting goals together.

## Features

- **Journal Entries**: Write and save daily thoughts and reflections
- **Shared Memories**: Upload and organize photos and memories together
- **Gratitude Prompts**: Daily prompts to express appreciation for each other
- **Relationship Goals**: Set and track goals as a couple
- **User Authentication**: Secure login for couples

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Frontend**: React + Vite
- **Deployment**: Raspberry Pi + Cloudflared Tunnel

## Project Structure

```
relationship-journal/
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── database.js         # SQLite database setup
│   ├── auth.js             # Authentication utilities
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx
│   │   ├── api.js          # API client
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── deploy/                 # Deployment scripts and configs
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend will run on http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Deployment on Raspberry Pi

### Prerequisites

- Raspberry Pi (3 or newer recommended)
- Raspberry Pi OS (64-bit recommended)
- Node.js 18+
- nginx
- cloudflared

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
sudo apt install -y nginx

# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb
```

### Step 2: Clone and Setup Project

```bash
# Clone the repository
cd /home/pi
git clone <your-repo-url> relationship-journal
cd relationship-journal

# Setup backend
cd backend
npm install --production
cp .env.example .env
nano .env  # Configure your settings

# Setup frontend
cd ../frontend
npm install
npm run build
```

### Step 3: Configure Backend Service

```bash
sudo cp deploy/relationship-journal-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable relationship-journal-backend
sudo systemctl start relationship-journal-backend
sudo systemctl status relationship-journal-backend
```

### Step 4: Configure nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/relationship-journal
sudo ln -s /etc/nginx/sites-available/relationship-journal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup Cloudflare Tunnel

```bash
# Authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create relationship-journal

# Copy the tunnel ID from output
# Update deploy/cloudflared-config.yml with your tunnel ID

# Copy config
sudo mkdir -p /etc/cloudflared
sudo cp deploy/cloudflared-config.yml /etc/cloudflared/config.yml

# Install as a service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

### Step 6: Configure DNS

In your Cloudflare dashboard:
1. Go to your domain's DNS settings
2. Add a CNAME record pointing to your tunnel
   - Name: `journal` (or your preferred subdomain)
   - Target: `<tunnel-id>.cfargotunnel.com`

## Updating the Application

```bash
cd /home/pi/relationship-journal

# Pull latest changes
git pull

# Update backend
cd backend
npm install --production
sudo systemctl restart relationship-journal-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart nginx
```

## Backup Database

```bash
# Create backup
cp /home/pi/relationship-journal/backend/relationship-journal.db ~/backups/relationship-journal-$(date +%Y%m%d).db

# Setup automatic backups with cron
crontab -e
# Add: 0 2 * * * cp /home/pi/relationship-journal/backend/relationship-journal.db ~/backups/relationship-journal-$(date +\%Y\%m\%d).db
```

## Troubleshooting

### Backend not starting
```bash
sudo systemctl status relationship-journal-backend
journalctl -u relationship-journal-backend -f
```

### Frontend not loading
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Cloudflared tunnel issues
```bash
sudo systemctl status cloudflared
journalctl -u cloudflared -f
```

## Security Considerations

- Change the JWT_SECRET in .env to a strong random value
- Keep your system and dependencies updated
- Regularly backup your database
- Use strong passwords for user accounts
- Monitor logs for suspicious activity

## License

MIT
