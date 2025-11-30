import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'levelup-journal.db'));

// Initialize database schema
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table - for the couple
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          display_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Journal entries table
      db.run(`
        CREATE TABLE IF NOT EXISTS journal_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT,
          content TEXT NOT NULL,
          entry_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Memories/Photos table
      db.run(`
        CREATE TABLE IF NOT EXISTS memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          photo_path TEXT,
          memory_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Gratitude entries table
      db.run(`
        CREATE TABLE IF NOT EXISTS gratitude_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          entry_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Relationship goals table
      db.run(`
        CREATE TABLE IF NOT EXISTS goals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          target_date DATE,
          status TEXT DEFAULT 'active',
          created_by INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Question categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS question_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          display_order INTEGER NOT NULL
        )
      `);

      // Questions table (main prompts)
      db.run(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL,
          week_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          main_prompt TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES question_categories (id)
        )
      `);

      // Question details table (guiding sub-questions)
      db.run(`
        CREATE TABLE IF NOT EXISTS question_details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          detail_text TEXT NOT NULL,
          display_order INTEGER NOT NULL,
          FOREIGN KEY (question_id) REFERENCES questions (id)
        )
      `);

      // Question responses table
      db.run(`
        CREATE TABLE IF NOT EXISTS question_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          response_text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (question_id) REFERENCES questions (id),
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(question_id, user_id)
        )
      `);

      // Question discussions table - for tracking joint discussion status
      db.run(`
        CREATE TABLE IF NOT EXISTS question_discussions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL UNIQUE,
          discussed_at DATETIME,
          joint_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (question_id) REFERENCES questions (id)
        )
      `);

      // ============= JOURNEY BOOK SYSTEM TABLES =============

      // Journeys table - Workbooks/journeys users can enroll in
      db.run(`
        CREATE TABLE IF NOT EXISTS journeys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          cover_image_url TEXT,
          duration_weeks INTEGER NOT NULL,
          cadence TEXT NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          is_default BOOLEAN DEFAULT 0,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Journey tasks table - Tasks within each journey
      db.run(`
        CREATE TABLE IF NOT EXISTS journey_tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          journey_id INTEGER NOT NULL,
          task_order INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          task_type TEXT NOT NULL,
          question_id INTEGER,
          estimated_time_minutes INTEGER,
          page_number INTEGER NOT NULL,
          chapter_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (journey_id) REFERENCES journeys (id) ON DELETE CASCADE,
          FOREIGN KEY (question_id) REFERENCES questions (id),
          UNIQUE(journey_id, task_order)
        )
      `);

      // User journeys table - User enrollment tracking
      db.run(`
        CREATE TABLE IF NOT EXISTS user_journeys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          journey_id INTEGER NOT NULL,
          enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          start_date DATE NOT NULL,
          current_task_id INTEGER,
          status TEXT DEFAULT 'active',
          completion_percentage REAL DEFAULT 0,
          completed_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (journey_id) REFERENCES journeys (id),
          FOREIGN KEY (current_task_id) REFERENCES journey_tasks (id),
          UNIQUE(user_id, journey_id)
        )
      `);

      // User task progress table - Track completion of individual tasks
      db.run(`
        CREATE TABLE IF NOT EXISTS user_task_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_journey_id INTEGER NOT NULL,
          task_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          due_date DATE,
          started_at DATETIME,
          completed_at DATETIME,
          is_overdue BOOLEAN DEFAULT 0,
          question_response_id INTEGER,
          discussion_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_journey_id) REFERENCES user_journeys (id) ON DELETE CASCADE,
          FOREIGN KEY (task_id) REFERENCES journey_tasks (id),
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (question_response_id) REFERENCES question_responses (id),
          FOREIGN KEY (discussion_id) REFERENCES question_discussions (id),
          UNIQUE(user_journey_id, task_id, user_id)
        )
      `);

      // User roles table - Admin permissions
      db.run(`
        CREATE TABLE IF NOT EXISTS user_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          role TEXT NOT NULL,
          granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, role)
        )
      `);

      // Create indexes for performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_journeys_user_status
              ON user_journeys(user_id, status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_task_progress_due_date
              ON user_task_progress(due_date, status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_journey_tasks_journey
              ON journey_tasks(journey_id, task_order)`, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

export default db;
