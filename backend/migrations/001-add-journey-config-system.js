import db from '../database.js';

/**
 * Migration: Add Journey Config System Tables
 *
 * Adds support for:
 * - Config-driven journeys
 * - Story slots and user stories
 * - SPARC/STAR framework
 * - Signal tracking and coverage
 * - Question metadata
 */

export async function up() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Journey Configurations
      db.run(`
        CREATE TABLE IF NOT EXISTS journey_configs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          config_file TEXT NOT NULL,
          parsed_config TEXT NOT NULL,
          version TEXT DEFAULT '1.0',
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Story Slots (Templates within a journey)
      db.run(`
        CREATE TABLE IF NOT EXISTS story_slots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          journey_id INTEGER NOT NULL,
          slot_key TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          signals TEXT,
          framework TEXT DEFAULT 'SPARC',
          estimated_minutes INTEGER DEFAULT 45,
          display_order INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE,
          UNIQUE(journey_id, slot_key)
        )
      `);

      // User Stories (User's actual SPARC/STAR responses)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_stories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          journey_id INTEGER NOT NULL,
          slot_id INTEGER,

          -- Story metadata
          story_title TEXT,
          year TEXT,
          stakeholders TEXT,
          stakes TEXT,

          -- SPARC structure
          situation TEXT,
          problem TEXT,
          actions TEXT,
          results TEXT,
          coda TEXT,

          -- STAR structure (alternative)
          star_situation TEXT,
          star_task TEXT,
          star_action TEXT,
          star_result TEXT,

          -- Compression & practice
          sixty_second_version TEXT,
          bullet_outline TEXT,

          -- Status
          framework TEXT DEFAULT 'SPARC',
          is_complete BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (journey_id) REFERENCES journeys(id),
          FOREIGN KEY (slot_id) REFERENCES story_slots(id)
        )
      `);

      // Signal Tagging for Stories
      db.run(`
        CREATE TABLE IF NOT EXISTS story_signals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          story_id INTEGER NOT NULL,
          signal_name TEXT NOT NULL,
          strength INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (story_id) REFERENCES user_stories(id) ON DELETE CASCADE,
          UNIQUE(story_id, signal_name)
        )
      `);

      // Question Metadata (Enhanced question bank)
      db.run(`
        CREATE TABLE IF NOT EXISTS question_metadata (
          question_id INTEGER PRIMARY KEY,
          category TEXT,
          signals TEXT,
          difficulty TEXT DEFAULT 'medium',
          roles TEXT,
          company_types TEXT,
          follow_ups TEXT,
          tips TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
        )
      `);

      // User Journey Progress (Step tracking)
      db.run(`
        CREATE TABLE IF NOT EXISTS user_journey_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_journey_id INTEGER NOT NULL,

          -- Configuration choices (Step 0)
          role TEXT,
          company_archetype TEXT,
          target_signals TEXT,

          -- Progress tracking
          current_step TEXT DEFAULT 'configure',
          completed_slots TEXT,

          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

          FOREIGN KEY (user_journey_id) REFERENCES user_journeys(id) ON DELETE CASCADE,
          UNIQUE(user_journey_id)
        )
      `);

      // Micro-prompts (Contextual questions for SPARC sections)
      db.run(`
        CREATE TABLE IF NOT EXISTS micro_prompts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          section TEXT NOT NULL,
          prompt_text TEXT NOT NULL,
          display_order INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Follow-up Questions (Generated or predefined)
      db.run(`
        CREATE TABLE IF NOT EXISTS story_follow_ups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          story_id INTEGER NOT NULL,
          question_text TEXT NOT NULL,
          is_generated BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (story_id) REFERENCES user_stories(id) ON DELETE CASCADE
        )
      `);

      // Indexes for performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_stories_user
              ON user_stories(user_id, journey_id)`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_story_signals_story
              ON story_signals(story_id)`);

      db.run(`CREATE INDEX IF NOT EXISTS idx_question_metadata_category
              ON question_metadata(category)`);

      console.log('✓ Journey config system tables created successfully');
      resolve();
    });
  });
}

export async function down() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS story_follow_ups');
      db.run('DROP TABLE IF EXISTS micro_prompts');
      db.run('DROP TABLE IF EXISTS user_journey_progress');
      db.run('DROP TABLE IF EXISTS question_metadata');
      db.run('DROP TABLE IF EXISTS story_signals');
      db.run('DROP TABLE IF EXISTS user_stories');
      db.run('DROP TABLE IF EXISTS story_slots');
      db.run('DROP TABLE IF EXISTS journey_configs');

      console.log('✓ Journey config system tables dropped');
      resolve();
    });
  });
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up()
    .then(() => {
      console.log('\nMigration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nMigration failed:', error);
      process.exit(1);
    });
}
