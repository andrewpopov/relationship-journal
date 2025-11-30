import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { hashPassword, comparePassword, generateToken, authenticateToken } from '../auth.js';

describe('Auth Functions', () => {
  describe('hashPassword', () => {
    test('should hash a password', () => {
      const password = 'testpassword123';
      const hashed = hashPassword(password);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    test('should create different hashes for same password (salt)', () => {
      const password = 'testpassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    test('should return true for correct password', () => {
      const password = 'testpassword123';
      const hashed = hashPassword(password);

      const result = comparePassword(password, hashed);
      expect(result).toBe(true);
    });

    test('should return false for incorrect password', () => {
      const password = 'testpassword123';
      const hashed = hashPassword(password);

      const result = comparePassword('wrongpassword', hashed);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      const userId = 1;
      const username = 'testuser@example.com';

      const token = generateToken(userId, username);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should include userId and username in token payload', () => {
      const userId = 1;
      const username = 'testuser@example.com';

      const token = generateToken(userId, username);
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

      expect(payload.userId).toBe(userId);
      expect(payload.username).toBe(username);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });
  });

  describe('authenticateToken middleware', () => {
    let app;

    beforeEach(() => {
      app = express();
      app.use(cors());
      app.use(express.json());

      app.get('/protected', authenticateToken, (req, res) => {
        res.json({ user: req.user });
      });
    });

    test('should allow access with valid token', async () => {
      const token = generateToken(1, 'testuser@example.com');

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.userId).toBe(1);
      expect(response.body.user.username).toBe('testuser@example.com');
    });

    test('should deny access without token', async () => {
      const response = await request(app)
        .get('/protected');

      expect(response.status).toBe(401);
    });

    test('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(403);
    });
  });
});
