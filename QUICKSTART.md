# Quick Start Guide

## Local Development (Your Computer)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs at http://localhost:3000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Raspberry Pi Deployment

### One-Command Deploy

```bash
# SSH into your Raspberry Pi
ssh pi@raspberrypi.local

# Clone the project
git clone <your-repo-url> /home/pi/relationship-journal

# Run deployment script
cd /home/pi/relationship-journal
chmod +x deploy/deploy.sh
bash deploy/deploy.sh

# Setup Cloudflare Tunnel
chmod +x deploy/setup-cloudflared.sh
bash deploy/setup-cloudflared.sh
```

### After Deployment

1. **Configure environment**
   ```bash
   nano /home/pi/relationship-journal/backend/.env
   # Set a secure JWT_SECRET
   sudo systemctl restart relationship-journal-backend
   ```

2. **Test locally**
   - Visit http://raspberrypi.local or http://your-pi-ip

3. **Access publicly**
   - Visit your configured domain (e.g., https://journal.yourdomain.com)

## Updating the App

```bash
cd /home/pi/relationship-journal
git pull
bash deploy/update.sh
```

## Useful Commands

```bash
# Check backend status
sudo systemctl status relationship-journal-backend

# View backend logs
journalctl -u relationship-journal-backend -f

# Check tunnel status
sudo systemctl status cloudflared

# Restart everything
sudo systemctl restart relationship-journal-backend
sudo systemctl restart nginx
sudo systemctl restart cloudflared
```

## First Time Setup

1. Visit your application URL
2. Click "Register"
3. Create accounts for both partners
4. Start journaling!

## Features

- **Journal**: `/journal` - Daily reflections and thoughts
- **Memories**: `/memories` - Upload photos and share moments
- **Gratitude**: `/gratitude` - Express appreciation daily
- **Goals**: `/goals` - Set and track relationship goals

## Backup Your Data

```bash
# Backup database
cp /home/pi/relationship-journal/backend/relationship-journal.db ~/backups/

# Backup uploaded photos
cp -r /home/pi/relationship-journal/backend/uploads ~/backups/
```

## Troubleshooting

**Can't access the site?**
- Check if backend is running: `sudo systemctl status relationship-journal-backend`
- Check nginx: `sudo systemctl status nginx`
- Check cloudflared: `sudo systemctl status cloudflared`

**Login issues?**
- Make sure JWT_SECRET is set in backend/.env
- Clear browser cache and cookies

**Photos not uploading?**
- Check uploads directory permissions: `ls -la /home/pi/relationship-journal/backend/uploads`
- Check nginx configuration for /uploads location

## Support

Check the full README.md for detailed documentation and troubleshooting steps.
