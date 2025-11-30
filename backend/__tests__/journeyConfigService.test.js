import journeyConfigService from '../services/journeyConfigService.js';
import db from '../database.js';

describe('JourneyConfigService', () => {
  describe('loadSignals', () => {
    test('should load signal definitions from config file', async () => {
      const signals = await journeyConfigService.loadSignals();

      expect(signals).toBeDefined();
      expect(signals.signals).toBeInstanceOf(Array);
      expect(signals.signals.length).toBeGreaterThan(0);
      expect(signals.company_archetypes).toBeInstanceOf(Array);
      expect(signals.roles).toBeInstanceOf(Array);
    });

    test('should return cached signals on second call', async () => {
      const signals1 = await journeyConfigService.loadSignals();
      const signals2 = await journeyConfigService.loadSignals();

      expect(signals1).toBe(signals2); // Same reference
    });

    test('signal objects should have required properties', async () => {
      const signals = await journeyConfigService.loadSignals();
      const firstSignal = signals.signals[0];

      expect(firstSignal).toHaveProperty('id');
      expect(firstSignal).toHaveProperty('name');
      expect(firstSignal).toHaveProperty('description');
      expect(firstSignal).toHaveProperty('roles');
    });

    test('should include all expected signals', async () => {
      const signals = await journeyConfigService.loadSignals();
      const signalIds = signals.signals.map(s => s.id);

      const expectedSignals = [
        'ownership',
        'ambiguity',
        'collaboration',
        'conflict',
        'leadership',
        'craft',
        'product_sense'
      ];

      expectedSignals.forEach(signal => {
        expect(signalIds).toContain(signal);
      });
    });
  });

  describe('loadJourneyConfig', () => {
    test('should load IC SWE journey config', async () => {
      const config = await journeyConfigService.loadJourneyConfig('ic-swe-journey');

      expect(config).toBeDefined();
      expect(config.journey).toBeDefined();
      expect(config.journey.title).toContain('IC');
      expect(config.journey.story_slots).toBeInstanceOf(Array);
    });

    test('should load EM journey config', async () => {
      const config = await journeyConfigService.loadJourneyConfig('em-journey');

      expect(config).toBeDefined();
      expect(config.journey).toBeDefined();
      expect(config.journey.title).toContain('Manager');
      expect(config.journey.story_slots).toBeInstanceOf(Array);
    });

    test('should cache journey configs', async () => {
      const config1 = await journeyConfigService.loadJourneyConfig('ic-swe-journey');
      const config2 = await journeyConfigService.loadJourneyConfig('ic-swe-journey');

      expect(config1).toBe(config2); // Same reference
    });

    test('should throw error for non-existent config', async () => {
      await expect(
        journeyConfigService.loadJourneyConfig('non-existent-journey')
      ).rejects.toThrow();
    });

    test('story slots should have required properties', async () => {
      const config = await journeyConfigService.loadJourneyConfig('ic-swe-journey');
      const firstSlot = config.journey.story_slots[0];

      expect(firstSlot).toHaveProperty('id');
      expect(firstSlot).toHaveProperty('title');
      expect(firstSlot).toHaveProperty('description');
      expect(firstSlot).toHaveProperty('signals');
      expect(firstSlot).toHaveProperty('framework');
      expect(firstSlot).toHaveProperty('estimated_minutes');
      expect(firstSlot).toHaveProperty('display_order');
    });
  });

  describe('createJourneyFromConfig', () => {
    test('should create journey in database from config', (done) => {
      journeyConfigService.createJourneyFromConfig('ic-swe-journey')
        .then((journeyId) => {
          expect(journeyId).toBeDefined();
          expect(typeof journeyId).toBe('number');

          // Verify journey was created in DB
          db.get(
            'SELECT * FROM journeys WHERE id = ?',
            [journeyId],
            (err, row) => {
              expect(err).toBeNull();
              expect(row).toBeDefined();
              expect(row.title).toContain('IC');
              done();
            }
          );
        })
        .catch(done);
    });

    test('should not create duplicate journey if it already exists', (done) => {
      journeyConfigService.createJourneyFromConfig('ic-swe-journey')
        .then((journeyId1) => {
          journeyConfigService.createJourneyFromConfig('ic-swe-journey')
            .then((journeyId2) => {
              expect(journeyId1).toBe(journeyId2); // Same ID
              done();
            })
            .catch(done);
        })
        .catch(done);
    });

    test('should create story slots for journey', (done) => {
      journeyConfigService.createJourneyFromConfig('ic-swe-journey')
        .then((journeyId) => {
          db.all(
            'SELECT * FROM story_slots WHERE journey_id = ?',
            [journeyId],
            (err, rows) => {
              expect(err).toBeNull();
              expect(rows).toBeDefined();
              expect(rows.length).toBeGreaterThan(0);
              expect(rows[0]).toHaveProperty('slot_key');
              expect(rows[0]).toHaveProperty('title');
              expect(rows[0]).toHaveProperty('signals');
              done();
            }
          );
        })
        .catch(done);
    });
  });

  describe('getStorySlots', () => {
    let testJourneyId;

    beforeAll((done) => {
      journeyConfigService.createJourneyFromConfig('ic-swe-journey')
        .then((id) => {
          testJourneyId = id;
          done();
        })
        .catch(done);
    });

    test('should retrieve story slots for journey', async () => {
      const slots = await journeyConfigService.getStorySlots(testJourneyId);

      expect(Array.isArray(slots)).toBe(true);
      expect(slots.length).toBeGreaterThan(0);
    });

    test('should parse signals JSON for each slot', async () => {
      const slots = await journeyConfigService.getStorySlots(testJourneyId);
      const firstSlot = slots[0];

      expect(Array.isArray(firstSlot.signals)).toBe(true);
      expect(typeof firstSlot.signals[0]).toBe('string');
    });

    test('should order slots by display_order', async () => {
      const slots = await journeyConfigService.getStorySlots(testJourneyId);

      for (let i = 1; i < slots.length; i++) {
        expect(slots[i].display_order).toBeGreaterThanOrEqual(
          slots[i - 1].display_order
        );
      }
    });
  });

  describe('getMicroPrompts', () => {
    test('should retrieve micro-prompts for SPARC section', async () => {
      const prompts = await journeyConfigService.getMicroPrompts('situation');

      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBeGreaterThan(0);
    });

    test('should have prompt_text property', async () => {
      const prompts = await journeyConfigService.getMicroPrompts('problem');

      expect(prompts[0]).toHaveProperty('prompt_text');
      expect(typeof prompts[0].prompt_text).toBe('string');
    });

    test('should work for all SPARC sections', async () => {
      const sections = ['situation', 'problem', 'actions', 'results', 'coda'];

      for (const section of sections) {
        const prompts = await journeyConfigService.getMicroPrompts(section);
        expect(prompts.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getSignalCoverage', () => {
    test('should calculate signal coverage for user journey', async () => {
      // This would require creating test user stories and signals
      // Placeholder for coverage calculation test
      const coverage = await journeyConfigService.getSignalCoverage(1, 1);

      expect(Array.isArray(coverage)).toBe(true);
    });
  });

  describe('getUserStories', () => {
    test('should retrieve user stories for a journey', async () => {
      const stories = await journeyConfigService.getUserStories(1, 1);

      expect(Array.isArray(stories)).toBe(true);
    });
  });
});
