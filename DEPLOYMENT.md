# Deployment Guide - Level Up Journal to Raspberry Pi

**Status**: ✅ **READY FOR DEPLOYMENT**
**Date**: November 30, 2025
**Commit**: c2759b0

---

## 🚀 Changes Pushed to Remote

### Commit Summary
```
Add comprehensive behavioral interview system and test suite

76 files changed, 26905 insertions(+), 664 deletions(-)
```

### What's Included

#### 1. **Behavioral Interview System** ✅
- IC SWE Journey (7 story slots)
- EM Journey (8 story slots)
- SPARC/STAR framework support
- Signal tracking (10 competencies)

#### 2. **React Components** ✅
- `StorySlotDashboard.jsx` - Journey overview
- `StoryBuilder.jsx` - 8-step wizard for story creation
- `SPARCSection.jsx` - Reusable SPARC section editor
- `SignalTagger.jsx` - Signal selection & rating
- `CoverageVisualizer.jsx` - Signal coverage analytics

#### 3. **Backend Features** ✅
- 10 new API endpoints
- Journey configuration service
- Story slot management
- Signal tracking system
- Micro-prompt system for SPARC guidance

#### 4. **Database** ✅
- Schema migration for new tables
- Story slots table
- User stories table
- Story signals table
- Micro prompts table
- Journey configs table

#### 5. **Tests** ✅
- 80 tests (100% passing)
- 5 test suites
- Full coverage of new features

#### 6. **Documentation** ✅
- Implementation plan
- Testing guides
- API documentation
- Deployment scripts

---

## 📋 Deployment Steps

### On Your Local Machine (Already Done ✅)
```bash
✅ Committed all changes
✅ Pushed to remote (origin/master)
```

### On Raspberry Pi (Next Steps)

#### 1. **Clone/Update Repository**
```bash
# If first time:
cd /home/pi
git clone https://github.com/andrewpopov/relationship-journal.git
cd relationship-journal
git checkout master

# If already cloned:
cd /home/pi/relationship-journal
git pull origin master
```

#### 2. **Run Deployment Script**
```bash
cd /home/pi/relationship-journal
bash deploy/deploy.sh
```

This script will:
- Update system packages
- Install Node.js v18 (if needed)
- Install nginx (if needed)
- Install backend dependencies
- Build frontend
- Set up systemd service
- Configure nginx
- Create uploads directory

#### 3. **Configure Environment Variables**
```bash
# Edit backend configuration
nano /home/pi/relationship-journal/backend/.env

# Required variables:
JWT_SECRET=<generate-random-string>
NODE_ENV=production
PORT=3001
DATABASE_URL=sqlite:./levelup-journal.db
```

**Generate JWT_SECRET:**
```bash
# On any system with openssl:
openssl rand -base64 32
```

#### 4. **Initialize Database**
```bash
cd /home/pi/relationship-journal/backend

# Initialize behavioral journey system
node init-behavioral-journey.js

# Seed IC interview questions
node seed-ic-questions.js

# Seed EM interview questions
node seed-em-questions.js

# Seed relationship journey (if needed)
node seed-relationship-journey.js
```

#### 5. **Start Services**
```bash
# Start backend service
sudo systemctl start relationship-journal-backend
sudo systemctl status relationship-journal-backend

# Check nginx
sudo systemctl status nginx

# Verify backend is running
curl http://localhost:3001/api/health
```

#### 6. **Setup Tunnel Access (Optional)**
```bash
# If using Cloudflared tunnel
bash deploy/setup-cloudflared.sh

# Then update your domain/tunnel settings
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Backend service is running: `sudo systemctl status relationship-journal-backend`
- [ ] Frontend is accessible: `curl http://localhost`
- [ ] API health check: `curl http://localhost:3001/api/health`
- [ ] Database tables created: Check `backend/levelup-journal.db`
- [ ] Relationship journey exists
- [ ] IC SWE journey exists
- [ ] EM journey exists
- [ ] Can login to application
- [ ] Dashboard shows both journey types
- [ ] Story slots appear for behavioral journeys

---

## 📊 Deployment Artifacts

### Files on Remote
- **Source Code**: All application code
- **Tests**: Complete test suite
- **Documentation**: Implementation guides
- **Database Scripts**: All seeding scripts
- **Configuration**: nginx, systemd, environment templates
- **Deployment Script**: Automated setup script

### Database Size (Estimated)
- Initial DB: < 5MB
- With seed data: ~10MB
- With user data: Will grow over time

### Disk Space Required
- Node modules: ~500MB
- Application: ~50MB
- Database: ~10MB
- Total: ~600MB

---

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to unique, strong value
- [ ] Set NODE_ENV=production
- [ ] Configure firewall rules
- [ ] Setup HTTPS (nginx + SSL certificate)
- [ ] Configure Cloudflared tunnel (for remote access)
- [ ] Disable SSH password login (use keys only)
- [ ] Enable fail2ban or similar protection
- [ ] Regular backups of database
- [ ] Monitor logs: `journalctl -u relationship-journal-backend -f`

---

## 📈 Monitoring & Maintenance

### Check Service Status
```bash
sudo systemctl status relationship-journal-backend
sudo systemctl status nginx
```

### View Logs
```bash
# Backend logs (real-time)
journalctl -u relationship-journal-backend -f

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
# After code updates
cd /home/pi/relationship-journal
git pull origin master
npm install --production
sudo systemctl restart relationship-journal-backend

# Or use update script
bash deploy/update.sh
```

### Database Backup
```bash
# Backup database
cp backend/levelup-journal.db backend/levelup-journal.db.backup

# Compress backup
tar -czf levelup-journal-backup-$(date +%Y%m%d).tar.gz backend/levelup-journal.db
```

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
journalctl -u relationship-journal-backend -n 50

# Check if port 3001 is in use
sudo lsof -i :3001

# Restart service
sudo systemctl restart relationship-journal-backend
```

### Frontend shows blank page
```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Verify nginx config
sudo nginx -t

# Check if backend is responding
curl http://localhost:3001/api/health
```

### Database locked error
```bash
# Kill existing connections
sudo systemctl restart relationship-journal-backend

# Check database file permissions
ls -la backend/levelup-journal.db
chmod 644 backend/levelup-journal.db
```

### Out of disk space
```bash
# Check disk usage
df -h

# Remove old backups
rm backend/levelup-journal.db.backup.*

# Clean npm cache
npm cache clean --force
```

---

## 📞 Support & Updates

### Stay Updated
```bash
cd /home/pi/relationship-journal
git fetch origin
git log --oneline master..origin/master  # See new commits
git pull origin master                    # Update
```

### Monitor Performance
```bash
# Check CPU/Memory
top -p $(pgrep -f "node.*server.js")

# Check process details
ps aux | grep node
```

### Restart Everything
```bash
# If something is broken
sudo systemctl restart relationship-journal-backend
sudo systemctl restart nginx
sudo systemctl status relationship-journal-backend
sudo systemctl status nginx
```

---

## 🎯 Deployment Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Source Code** | ✅ Pushed | All 76 files committed |
| **Tests** | ✅ Passing | 80/80 tests pass |
| **Documentation** | ✅ Complete | All guides included |
| **Deployment Script** | ✅ Ready | `deploy/deploy.sh` |
| **Database Schema** | ✅ Updated | New behavioral system tables |
| **Configuration** | ✅ Ready | Templates provided |

---

## ✨ What's New in This Deployment

1. **Behavioral Interview Prep System**
   - Config-driven journeys (IC & EM)
   - Story building with SPARC framework
   - Signal/competency tracking
   - Complete API (10 endpoints)

2. **Enhanced React Components**
   - 5 new behavioral components
   - Full story building workflow
   - Signal visualization
   - Coverage analytics

3. **Testing Infrastructure**
   - 80 comprehensive tests
   - All tests passing (100%)
   - Integration & unit tests
   - Full API coverage

4. **Relationship Journey**
   - Fully preserved & backward compatible
   - Works alongside new system
   - No conflicts or data loss

---

## 🚀 After Deployment

Once running on Raspberry Pi:

1. ✅ Verify all services running
2. ✅ Test both journey types (relationship + behavioral)
3. ✅ Create test user and stories
4. ✅ Check signal coverage functionality
5. ✅ Monitor logs for errors
6. ✅ Setup automated backups
7. ✅ Configure remote access tunnel (if needed)

---

**Status**: Ready for production deployment! 🎉
