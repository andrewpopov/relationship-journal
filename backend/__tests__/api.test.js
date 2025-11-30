import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { hashPassword, generateToken, authenticateToken } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('API Endpoints', () => {
  let app;
  let db;
  let testToken;
  let testUserId;

  beforeAll(() => {
    // Create in-memory test database
    db = new sqlite3.Database(':memory:');

    // Initialize schema
    db.serialize(() => {
      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        entry_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      db.run(`CREATE TABLE gratitude_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        entry_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);
    });

    // Set up Express app
    app = express();
    app.use(cors());
    app.use(express.json());

    // Auth routes
    app.post('/api/auth/register', (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      const displayName = username.split('@')[0];
      const passwordHash = hashPassword(password);

      db.run(
        'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)',
        [username, passwordHash, displayName],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ error: 'This email is already registered' });
            }
            return res.status(500).json({ error: 'Error creating account' });
          }

          const token = generateToken(this.lastID, username);
          res.json({
            token,
            user: { id: this.lastID, username, displayName }
          });
        }
      );
    });

    // Journal routes
    app.get('/api/journal-entries', authenticateToken, (req, res) => {
      db.all(
        'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY entry_date DESC',
        [req.user.userId],
        (err, entries) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching entries' });
          }
          res.json(entries);
        }
      );
    });

    app.post('/api/journal-entries', authenticateToken, (req, res) => {
      const { title, content, entryDate } = req.body;
      const userId = req.user.userId;

      if (!content || !entryDate) {
        return res.status(400).json({ error: 'Content and date are required' });
      }

      db.run(
        'INSERT INTO journal_entries (user_id, title, content, entry_date) VALUES (?, ?, ?, ?)',
        [userId, title || null, content, entryDate],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating entry' });
          }
          res.json({ id: this.lastID, message: 'Entry created successfully' });
        }
      );
    });

    // Gratitude routes
    app.get('/api/gratitude', authenticateToken, (req, res) => {
      db.all(
        'SELECT * FROM gratitude_entries WHERE user_id = ? ORDER BY entry_date DESC',
        [req.user.userId],
        (err, entries) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching entries' });
          }
          res.json(entries);
        }
      );
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user with valid email and password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('test@example.com');
      expect(response.body.user.displayName).toBe('test');

      // Save for later tests
      testToken = response.body.token;
      testUserId = response.body.user.id;
    });

    test('should reject registration without email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    test('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'notanemail',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Please enter a valid email address');
    });

    test('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('This email is already registered');
    });
  });

  describe('Journal Entries API', () => {
    test('GET /api/journal-entries should require authentication', async () => {
      const response = await request(app)
        .get('/api/journal-entries');

      expect(response.status).toBe(401);
    });

    test('GET /api/journal-entries should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/journal-entries')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('POST /api/journal-entries should create a new entry', async () => {
      const response = await request(app)
        .post('/api/journal-entries')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Test Entry',
          content: 'This is a test journal entry.',
          entryDate: '2025-01-23'
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.message).toBe('Entry created successfully');
    });

    test('POST /api/journal-entries should require content and date', async () => {
      const response = await request(app)
        .post('/api/journal-entries')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Test Entry'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Content and date are required');
    });

    test('GET /api/journal-entries should return created entries', async () => {
      const response = await request(app)
        .get('/api/journal-entries')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].content).toBe('This is a test journal entry.');
    });
  });

  describe('Gratitude Entries API', () => {
    test('GET /api/gratitude should require authentication', async () => {
      const response = await request(app)
        .get('/api/gratitude');

      expect(response.status).toBe(401);
    });

    test('GET /api/gratitude should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/gratitude')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
