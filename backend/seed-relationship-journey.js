import db from './database.js';

/**
 * Seed Script: A Year of Conversations Journey
 *
 * Creates a 32-week couples journey with relationship-building questions
 */

const relationshipQuestions = [
  // Week 1-4: Foundation
  {
    category: 'Our Foundation',
    week: 1,
    title: 'Our Love Story',
    prompt: 'Tell the story of how you met and fell in love. What attracted you to your partner?',
    details: [
      'Where and when did you first meet?',
      'What was your first impression of each other?',
      'When did you realize you were in love?',
      'What made you decide to commit to this relationship?'
    ]
  },
  {
    category: 'Our Foundation',
    week: 2,
    title: 'Core Values',
    prompt: 'What are the top 5 values that guide your life? How do they align with your partner\'s values?',
    details: [
      'What principles do you refuse to compromise on?',
      'Which values do you share with your partner?',
      'Where do your values differ?',
      'How do you navigate value differences?'
    ]
  },
  {
    category: 'Our Foundation',
    week: 3,
    title: 'Relationship Vision',
    prompt: 'What does your ideal relationship look like 5, 10, and 20 years from now?',
    details: [
      'What kind of partnership do you want to build?',
      'How do you want to grow together?',
      'What adventures do you want to share?',
      'What legacy do you want to create as a couple?'
    ]
  },
  {
    category: 'Our Foundation',
    week: 4,
    title: 'Non-Negotiables',
    prompt: 'What are your dealbreakers and must-haves in this relationship?',
    details: [
      'What behaviors or situations are unacceptable to you?',
      'What needs must be met for you to feel fulfilled?',
      'How do you communicate your boundaries?',
      'What are you willing to compromise on?'
    ]
  },

  // Week 5-8: Communication & Connection
  {
    category: 'Communication & Connection',
    week: 5,
    title: 'Communication Styles',
    prompt: 'How do you each prefer to communicate? What patterns have you noticed in your conversations?',
    details: [
      'Are you a processor or a verbal thinker?',
      'Do you prefer direct or indirect communication?',
      'When do you communicate best (time of day, setting)?',
      'What helps you feel heard and understood?'
    ]
  },
  {
    category: 'Communication & Connection',
    week: 6,
    title: 'Love Languages',
    prompt: 'What makes you feel most loved? How do you express love to your partner?',
    details: [
      'Which love language resonates most with you?',
      'How does your partner show love in their way?',
      'What small gestures mean the most to you?',
      'How can you better speak your partner\'s love language?'
    ]
  },
  {
    category: 'Communication & Connection',
    week: 7,
    title: 'Quality Time',
    prompt: 'What does quality time together look like for each of you?',
    details: [
      'What activities help you feel most connected?',
      'How much alone time vs. together time do you each need?',
      'What distractions get in the way of quality time?',
      'What new ways could you spend time together?'
    ]
  },
  {
    category: 'Communication & Connection',
    week: 8,
    title: 'Emotional Safety',
    prompt: 'What makes you feel emotionally safe with your partner? When do you feel vulnerable?',
    details: [
      'What helps you open up emotionally?',
      'When do you tend to shut down or withdraw?',
      'How can your partner support you in difficult moments?',
      'What builds trust and safety in your relationship?'
    ]
  },

  // Week 9-12: Navigating Challenges
  {
    category: 'Navigating Challenges',
    week: 9,
    title: 'Conflict Patterns',
    prompt: 'What patterns do you notice in your conflicts? How do you typically respond to disagreements?',
    details: [
      'Are you a pursuer or a withdrawer in conflicts?',
      'What triggers escalate your arguments?',
      'What helps de-escalate tension?',
      'What do you need from your partner during conflict?'
    ]
  },
  {
    category: 'Navigating Challenges',
    week: 10,
    title: 'Repair and Forgiveness',
    prompt: 'How do you repair after a conflict? What does forgiveness look like in your relationship?',
    details: [
      'How do you know when you\'re ready to reconnect?',
      'What helps you forgive and let go?',
      'How do you rebuild trust after hurt?',
      'What makes a good apology for you?'
    ]
  },
  {
    category: 'Navigating Challenges',
    week: 11,
    title: 'Stress and External Pressures',
    prompt: 'How do work, family, and life stressors affect your relationship? How do you support each other?',
    details: [
      'What external pressures create the most strain?',
      'How does stress affect your behavior toward each other?',
      'What support do you need when you\'re stressed?',
      'How can you be a team against outside stress?'
    ]
  },
  {
    category: 'Navigating Challenges',
    week: 12,
    title: 'Past Wounds',
    prompt: 'What past experiences or wounds affect how you show up in this relationship?',
    details: [
      'What patterns from your family of origin do you notice?',
      'What past hurts are you still healing from?',
      'How do these wounds affect your relationship?',
      'What healing do you need, and how can your partner support that?'
    ]
  },

  // Week 13-16: Practical Partnership
  {
    category: 'Practical Partnership',
    week: 13,
    title: 'Household Responsibilities',
    prompt: 'How do you divide household tasks and responsibilities? What\'s working and what needs adjustment?',
    details: [
      'What\'s the current division of labor?',
      'What tasks do you enjoy vs. resent?',
      'What feels fair vs. unfair?',
      'How can you redistribute responsibilities more equitably?'
    ]
  },
  {
    category: 'Practical Partnership',
    week: 14,
    title: 'Financial Partnership',
    prompt: 'What are your money values, goals, and concerns? How do you make financial decisions together?',
    details: [
      'What did you learn about money growing up?',
      'What are your financial goals and fears?',
      'How do you handle spending and saving?',
      'What money conversations do you need to have?'
    ]
  },
  {
    category: 'Practical Partnership',
    week: 15,
    title: 'Decision-Making',
    prompt: 'How do you make decisions together? What decisions need both voices vs. individual autonomy?',
    details: [
      'What\'s your decision-making process as a couple?',
      'Where do you need consensus vs. individual freedom?',
      'How do you handle decision deadlocks?',
      'What makes you feel respected in the decision-making process?'
    ]
  },
  {
    category: 'Practical Partnership',
    week: 16,
    title: 'Social Life and Friendships',
    prompt: 'How do you balance couple time, individual friendships, and shared social life?',
    details: [
      'How much time do you each need with friends?',
      'What shared friendships enrich your relationship?',
      'Do you need more or less social time together?',
      'How do you support each other\'s individual friendships?'
    ]
  },

  // Week 17-20: Intimacy & Growth
  {
    category: 'Intimacy & Growth',
    week: 17,
    title: 'Physical Intimacy',
    prompt: 'What does physical intimacy mean to you? How do you navigate differences in desire and needs?',
    details: [
      'What makes you feel desired and connected physically?',
      'How do you communicate about sex and affection?',
      'What barriers to intimacy exist?',
      'How can you prioritize physical connection?'
    ]
  },
  {
    category: 'Intimacy & Growth',
    week: 18,
    title: 'Emotional Intimacy',
    prompt: 'How do you create emotional closeness? What helps you feel deeply known by your partner?',
    details: [
      'What conversations bring you closer?',
      'When do you feel most understood?',
      'What parts of yourself do you still hide?',
      'How can you create more emotional vulnerability?'
    ]
  },
  {
    category: 'Intimacy & Growth',
    week: 19,
    title: 'Personal Growth',
    prompt: 'How are you each growing as individuals? How does your relationship support or hinder that growth?',
    details: [
      'What personal goals are you working toward?',
      'How does your partner encourage your growth?',
      'Where do you feel stuck or stagnant?',
      'How can you better support each other\'s development?'
    ]
  },
  {
    category: 'Intimacy & Growth',
    week: 20,
    title: 'Spirituality and Meaning',
    prompt: 'What gives your life meaning and purpose? How do you share or support each other\'s spiritual journey?',
    details: [
      'What are your spiritual or philosophical beliefs?',
      'What practices bring you peace or connection?',
      'How do you navigate different beliefs?',
      'What bigger purpose guides your relationship?'
    ]
  },

  // Week 21-24: Family & Future
  {
    category: 'Family & Future',
    week: 21,
    title: 'Family of Origin',
    prompt: 'How do your families of origin affect your relationship? What family patterns do you want to keep or change?',
    details: [
      'What did you learn about relationships from your parents?',
      'What family dynamics do you bring to this relationship?',
      'How involved should extended family be?',
      'What boundaries do you need with family?'
    ]
  },
  {
    category: 'Family & Future',
    week: 22,
    title: 'Children and Parenting',
    prompt: 'What are your thoughts on having children? If you have kids, how do you co-parent?',
    details: [
      'Do you want children? How many and when?',
      'What kind of parents do you want to be?',
      'How do you handle disagreements about parenting?',
      'How do you prioritize your relationship while parenting?'
    ]
  },
  {
    category: 'Family & Future',
    week: 23,
    title: 'Career and Ambitions',
    prompt: 'What are your career goals and dreams? How do you support each other\'s professional ambitions?',
    details: [
      'What does career success look like for you?',
      'What sacrifices might your careers require?',
      'How do you balance two careers?',
      'What would you do if you had to choose between career and relationship?'
    ]
  },
  {
    category: 'Family & Future',
    week: 24,
    title: 'Where to Live',
    prompt: 'Where do you each want to live? How do you navigate preferences about location, home, and lifestyle?',
    details: [
      'What\'s your ideal living situation?',
      'Would you move for a partner\'s job or family?',
      'What does "home" mean to you?',
      'How do you create a home together?'
    ]
  },

  // Week 25-28: Deepening Connection
  {
    category: 'Deepening Connection',
    week: 25,
    title: 'Adventures and Fun',
    prompt: 'What brings joy and playfulness to your relationship? What adventures do you want to share?',
    details: [
      'When do you laugh together most?',
      'What new experiences do you want to try?',
      'How can you bring more fun into daily life?',
      'What shared hobbies could you develop?'
    ]
  },
  {
    category: 'Deepening Connection',
    week: 26,
    title: 'Gratitude and Appreciation',
    prompt: 'What do you appreciate most about your partner? How do you express gratitude?',
    details: [
      'What qualities do you admire in your partner?',
      'What do they do that makes your life better?',
      'How do you show appreciation?',
      'What appreciation do you need to hear?'
    ]
  },
  {
    category: 'Deepening Connection',
    week: 27,
    title: 'Rituals and Traditions',
    prompt: 'What rituals and traditions make your relationship special? What new ones do you want to create?',
    details: [
      'What daily or weekly rituals do you cherish?',
      'What traditions do you want to continue or start?',
      'How do you celebrate milestones?',
      'What rituals help you stay connected?'
    ]
  },
  {
    category: 'Deepening Connection',
    week: 28,
    title: 'Support During Hardship',
    prompt: 'How do you want to support each other through life\'s inevitable hardships?',
    details: [
      'What past hardships have you weathered together?',
      'What support do you need during difficult times?',
      'How can you be there for each other better?',
      'What gives you hope during hard times?'
    ]
  },

  // Week 29-32: Looking Forward
  {
    category: 'Looking Forward',
    week: 29,
    title: 'Dreams and Aspirations',
    prompt: 'What dreams do you have for your life together? What adventures are on your bucket list?',
    details: [
      'What do you dream of experiencing together?',
      'What goals do you have as a couple?',
      'What legacy do you want to leave?',
      'How can you make your dreams reality?'
    ]
  },
  {
    category: 'Looking Forward',
    week: 30,
    title: 'Aging Together',
    prompt: 'What does growing old together look like? How do you want to support each other through aging?',
    details: [
      'What do you look forward to in growing older?',
      'What concerns do you have about aging?',
      'How will you care for each other?',
      'What kind of elderly couple do you want to be?'
    ]
  },
  {
    category: 'Looking Forward',
    week: 31,
    title: 'Continuous Renewal',
    prompt: 'How do you keep your relationship fresh and growing? What helps you avoid stagnation?',
    details: [
      'What makes your relationship feel alive?',
      'When do you feel most connected?',
      'What ruts do you want to avoid?',
      'How can you keep choosing each other?'
    ]
  },
  {
    category: 'Looking Forward',
    week: 32,
    title: 'Our Commitment',
    prompt: 'What does commitment mean to you? How do you want to recommit to this relationship going forward?',
    details: [
      'Why do you choose this person and this relationship?',
      'What promises do you make to each other?',
      'What commitment looks like in practice?',
      'How will you continue to nurture this love?'
    ]
  }
];

async function seedRelationshipJourney() {
  console.log('Starting relationship journey creation...\n');

  try {
    // Step 1: Create or get categories
    console.log('Setting up question categories...');
    const categories = [...new Set(relationshipQuestions.map(q => q.category))];
    const categoryMap = {};

    for (const categoryName of categories) {
      const existing = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM question_categories WHERE name = ?',
          [categoryName],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (existing) {
        categoryMap[categoryName] = existing.id;
      } else {
        const categoryId = await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO question_categories (name, description, display_order) VALUES (?, ?, ?)',
            [categoryName, `Couples questions for ${categoryName}`, Object.keys(categoryMap).length + 100],
            function(err) {
              if (err) reject(err);
              else resolve(this.lastID);
            }
          );
        });
        categoryMap[categoryName] = categoryId;
      }
    }

    console.log(`✓ Set up ${categories.length} categories\n`);

    // Step 2: Create journey
    console.log('Creating journey...');
    const journeyId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO journeys (
          title,
          description,
          duration_weeks,
          cadence,
          is_active,
          is_default
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'A Year of Conversations',
          'A thoughtfully curated collection of 32 meaningful conversations designed to deepen connection, understanding, and love between partners. Each week brings new insights into your relationship.',
          32,
          'weekly',
          1,
          1
        ],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log(`✓ Created journey (ID: ${journeyId})\n`);

    // Step 3: Create questions and tasks
    console.log('Creating questions and journey tasks...');
    let questionsCreated = 0;
    let tasksCreated = 0;

    for (const q of relationshipQuestions) {
      const categoryId = categoryMap[q.category];

      // Create question
      const questionId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO questions (
            category_id,
            week_number,
            title,
            main_prompt
          ) VALUES (?, ?, ?, ?)`,
          [categoryId, q.week, q.title, q.prompt],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      questionsCreated++;

      // Create question details
      for (let j = 0; j < q.details.length; j++) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO question_details (question_id, detail_text, display_order) VALUES (?, ?, ?)',
            [questionId, q.details[j], j + 1],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }

      // Create journey task
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO journey_tasks (
            journey_id,
            task_order,
            title,
            description,
            task_type,
            question_id,
            estimated_time_minutes,
            page_number,
            chapter_name
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            journeyId,
            q.week,
            q.title,
            q.prompt,
            'question',
            questionId,
            30,
            q.week,
            q.category
          ],
          (err) => {
            if (err) reject(err);
            else {
              tasksCreated++;
              resolve();
            }
          }
        );
      });
    }

    console.log(`✓ Created ${questionsCreated} questions`);
    console.log(`✓ Created ${tasksCreated} journey tasks\n`);

    console.log('='.repeat(60));
    console.log('✓ RELATIONSHIP JOURNEY CREATED!');
    console.log('='.repeat(60));
    console.log(`Journey ID: ${journeyId}`);
    console.log(`Total Questions: ${questionsCreated}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Duration: 32 weeks (weekly)`);
    console.log('='.repeat(60));

    return journeyId;

  } catch (error) {
    console.error('Error creating journey:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRelationshipJourney()
    .then(() => {
      console.log('\nJourney creation completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nJourney creation failed:', error);
      process.exit(1);
    });
}

export default seedRelationshipJourney;
