import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JOURNEYS_DIR = path.join(__dirname, '..', 'journeys');

/**
 * Journey Configuration Service
 *
 * Handles loading, parsing, and managing config-driven journeys
 */

class JourneyConfigService {
  constructor() {
    this.signals = null;
    this.loadedConfigs = new Map();
  }

  /**
   * Load signal definitions from config file
   */
  async loadSignals() {
    if (this.signals) return this.signals;

    const signalsPath = path.join(JOURNEYS_DIR, 'signals', 'competency-signals.json');
    const content = await fs.readFile(signalsPath, 'utf-8');
    this.signals = JSON.parse(content);
    return this.signals;
  }

  /**
   * Load a journey configuration file
   */
  async loadJourneyConfig(configName) {
    // Check cache
    if (this.loadedConfigs.has(configName)) {
      return this.loadedConfigs.get(configName);
    }

    const configPath = path.join(JOURNEYS_DIR, 'templates', `${configName}.json`);
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);

    // Cache it
    this.loadedConfigs.set(configName, config);
    return config;
  }

  /**
   * Create a journey in the database from a config file
   */
  async createJourneyFromConfig(configName) {
    const config = await this.loadJourneyConfig(configName);
    const journeyDef = config.journey;

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // Check if journey already exists
        db.get(
          'SELECT id FROM journeys WHERE title = ?',
          [journeyDef.title],
          (err, existing) => {
            if (err) return reject(err);
            if (existing) return resolve(existing.id);

            // Create journey
            db.run(
              `INSERT INTO journeys (
                title,
                description,
                duration_weeks,
                cadence,
                is_active
              ) VALUES (?, ?, ?, ?, ?)`,
              [
                journeyDef.title,
                journeyDef.description,
                journeyDef.duration_weeks,
                'flexible',
                1
              ],
              function(err) {
                if (err) return reject(err);

                const journeyId = this.lastID;

                // Store config reference
                db.run(
                  `INSERT INTO journey_configs (
                    config_file,
                    parsed_config
                  ) VALUES (?, ?)`,
                  [
                    configName,
                    JSON.stringify(config)
                  ],
                  (err) => {
                    if (err) console.error('Error storing config:', err);
                  }
                );

                // Create story slots
                const slots = journeyDef.story_slots || [];

                if (slots.length === 0) {
                  console.log(`✓ Created journey "${journeyDef.title}" (no story slots)`);
                  resolve(journeyId);
                  return;
                }

                let slotsCreated = 0;
                let slotsProcessed = 0;

                slots.forEach((slot, index) => {
                  db.run(
                    `INSERT INTO story_slots (
                      journey_id,
                      slot_key,
                      title,
                      description,
                      signals,
                      framework,
                      estimated_minutes,
                      display_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      journeyId,
                      slot.id,
                      slot.title,
                      slot.description,
                      JSON.stringify(slot.signals),
                      slot.framework || 'SPARC',
                      slot.estimated_minutes || 45,
                      slot.display_order || index + 1
                    ],
                    (err) => {
                      slotsProcessed++;
                      if (err) {
                        console.error('Error creating story slot:', err);
                      } else {
                        slotsCreated++;
                      }

                      if (slotsProcessed === slots.length) {
                        console.log(`✓ Created journey "${journeyDef.title}" with ${slotsCreated} story slots`);
                        resolve(journeyId);
                      }
                    }
                  );
                });
              }
            );
          }
        );
      });
    });
  }

  /**
   * Get journey config by journey ID
   */
  async getJourneyConfig(journeyId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT parsed_config FROM journey_configs WHERE id = ?',
        [journeyId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          resolve(JSON.parse(row.parsed_config));
        }
      );
    });
  }

  /**
   * Get story slots for a journey
   */
  async getStorySlots(journeyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM story_slots
         WHERE journey_id = ?
         ORDER BY display_order`,
        [journeyId],
        (err, rows) => {
          if (err) return reject(err);
          // Parse JSON fields
          rows.forEach(row => {
            if (row.signals) row.signals = JSON.parse(row.signals);
          });
          resolve(rows);
        }
      );
    });
  }

  /**
   * Get user's stories for a journey
   */
  async getUserStories(userId, journeyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.*, sl.slot_key, sl.title as slot_title
         FROM user_stories s
         LEFT JOIN story_slots sl ON s.slot_id = sl.id
         WHERE s.user_id = ? AND s.journey_id = ?
         ORDER BY sl.display_order`,
        [userId, journeyId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  /**
   * Get signal coverage for a user's journey
   */
  async getSignalCoverage(userId, journeyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT ss.signal_name, COUNT(*) as count, AVG(ss.strength) as avg_strength
         FROM story_signals ss
         JOIN user_stories us ON ss.story_id = us.id
         WHERE us.user_id = ? AND us.journey_id = ?
         GROUP BY ss.signal_name`,
        [userId, journeyId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  /**
   * Get SPARC micro-prompts for a section
   */
  async getMicroPrompts(section) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM micro_prompts WHERE section = ? AND is_active = 1 ORDER BY display_order',
        [section],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  /**
   * Seed default micro-prompts from journey config
   */
  async seedMicroPrompts(configName) {
    const config = await this.loadJourneyConfig(configName);
    const prompts = config.journey.sparc_micro_prompts;

    const sections = ['situation', 'problem', 'actions', 'results', 'coda'];
    let promptsCreated = 0;

    for (const section of sections) {
      if (!prompts[section]) continue;

      for (let i = 0; i < prompts[section].length; i++) {
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT OR IGNORE INTO micro_prompts (section, prompt_text, display_order)
             VALUES (?, ?, ?)`,
            [section, prompts[section][i], i + 1],
            (err) => {
              if (err) reject(err);
              else {
                promptsCreated++;
                resolve();
              }
            }
          );
        });
      }
    }

    console.log(`✓ Seeded ${promptsCreated} micro-prompts`);
    return promptsCreated;
  }
}

// Export singleton instance
const journeyConfigService = new JourneyConfigService();
export default journeyConfigService;
