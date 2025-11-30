# Level Up Journal

A personal growth platform for structured learning through guided journeys. Take courses in various areas of life - from relationship building to career development - while maintaining a personal journal, tracking goals, and preserving memories.

## Features

- **Guided Journeys**: Enroll in structured learning programs ("classes") covering various topics
- **Journey Library**: Browse and discover journeys including:
  - A Year of Conversations (couples communication)
  - Behavioral Interview Mastery (career development)
  - And more coming soon!
- **Journal Entries**: Write and save daily thoughts and reflections
- **Gratitude Practice**: Daily prompts to express thankfulness
- **Goal Tracking**: Set and track personal goals
- **Memory Preservation**: Upload and organize photos and special moments
- **User Authentication**: Secure personal accounts

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Frontend**: React + Vite
- **Deployment**: Raspberry Pi + Cloudflared Tunnel

## Project Structure

```
levelup-journal/
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
git clone <your-repo-url> levelup-journal
cd levelup-journal

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
sudo cp deploy/levelup-journal-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable levelup-journal-backend
sudo systemctl start levelup-journal-backend
sudo systemctl status levelup-journal-backend
```

### Step 4: Configure nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/levelup-journal
sudo ln -s /etc/nginx/sites-available/levelup-journal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup Cloudflare Tunnel

```bash
# Authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create levelup-journal

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
cd /home/pi/levelup-journal

# Pull latest changes
git pull

# Update backend
cd backend
npm install --production
sudo systemctl restart levelup-journal-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl restart nginx
```

## Backup Database

```bash
# Create backup
cp /home/pi/levelup-journal/backend/levelup-journal.db ~/backups/levelup-journal-$(date +%Y%m%d).db

# Setup automatic backups with cron
crontab -e
# Add: 0 2 * * * cp /home/pi/levelup-journal/backend/levelup-journal.db ~/backups/levelup-journal-$(date +\%Y\%m\%d).db
```

## Troubleshooting

### Backend not starting
```bash
sudo systemctl status levelup-journal-backend
journalctl -u levelup-journal-backend -f
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
