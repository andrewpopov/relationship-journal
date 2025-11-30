# Composable Journey System - Implementation Plan

## 📊 Project Status
- **Completed**: Core rebranding, journey foundation, database schema, config structure
- **In Progress**: Behavioral interview journey system
- **Remaining**: UI components, API endpoints, question banks

---

## 🎯 Atomic Tasks for Implementation

### Phase 1: Database & Backend Foundation ✅ MOSTLY COMPLETE

#### Task 1.1: Complete Database Tables
**Status**: IN PROGRESS
**File**: `backend/migrations/001-add-journey-config-system.js`
**Actions**:
1. Verify all tables were created in `levelup-journal.db`
2. Run: `cd backend && node init-behavioral-journey.js`
3. Verify journey created with story slots

**Success Criteria**:
- Tables exist: journey_configs, story_slots, user_stories, story_signals, micro_prompts
- IC SWE journey exists with 7 story slots

---

### Phase 2: Backend API Endpoints

#### Task 2.1: Story Slots API
**Status**: PENDING
**File**: `backend/server.js`
**Add these endpoints**:
```javascript
// Get story slots for a journey
GET /api/journeys/:journeyId/story-slots

// Get user's progress on story slots
GET /api/journeys/:journeyId/story-slots/progress
```

#### Task 2.2: User Stories API
**Status**: PENDING
**File**: `backend/server.js`
**Add these endpoints**:
```javascript
// Create/update a user story
POST /api/stories
PUT /api/stories/:storyId

// Get user's stories for a journey
GET /api/journeys/:journeyId/stories

// Get specific story
GET /api/stories/:storyId
```

#### Task 2.3: SPARC Sections API
**Status**: PENDING
**File**: `backend/server.js`
**Add these endpoints**:
```javascript
// Save SPARC section
PUT /api/stories/:storyId/sparc/:section

// Get micro-prompts for section
GET /api/sparc-prompts/:section
```

#### Task 2.4: Signal Tracking API
**Status**: PENDING
**File**: `backend/server.js`
**Add these endpoints**:
```javascript
// Tag story with signals
POST /api/stories/:storyId/signals

// Get signal coverage for journey
GET /api/journeys/:journeyId/signal-coverage

// Get recommended story slots based on gaps
GET /api/journeys/:journeyId/recommendations
```

---

### Phase 3: React Components - Story Building

#### Task 3.1: StorySlotDashboard Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/StorySlotDashboard.jsx`
**Requirements**:
```jsx
// Display 7 story slot cards
// Show: title, description, signals, completion status
// Click to start/continue story
// Show signal coverage summary
```

#### Task 3.2: StoryBuilder Wizard Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/StoryBuilder.jsx`
**Requirements**:
```jsx
// Multi-step wizard with progress bar
// Step 1: Story Seed (title, year, stakeholders, stakes)
// Step 2: Framework selector (SPARC/STAR)
// Step 3-7: SPARC sections
// Step 8: Signal tagging
// Auto-save on each step
```

#### Task 3.3: SPARCSection Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/SPARCSection.jsx`
**Requirements**:
```jsx
// Large textarea for section content
// Micro-prompts sidebar
// Character/word count
// Save draft functionality
// Tips and examples
```

#### Task 3.4: SignalTagger Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/SignalTagger.jsx`
**Requirements**:
```jsx
// Checkbox list of signals
// Strength selector (1-3 stars)
// Show signal descriptions
// Highlight recommended signals for this slot
```

#### Task 3.5: CoverageVisualizer Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/CoverageVisualizer.jsx`
**Requirements**:
```jsx
// Radar chart or bar chart
// Show signal distribution
// Highlight gaps
// Click to see which stories cover each signal
```

---

### Phase 4: React Components - Practice & Review

#### Task 4.1: StoryCompressor Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/StoryCompressor.jsx`
**Requirements**:
```jsx
// Side-by-side: Full story | 60-second version
// Timer for practice
// Word count limits
// Save compressed version
```

#### Task 4.2: BulletOutliner Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/BulletOutliner.jsx`
**Requirements**:
```jsx
// Extract key points from SPARC sections
// Editable bullet list
// Reorder bullets
// Export/print functionality
```

#### Task 4.3: FollowUpGenerator Component
**Status**: PENDING
**File**: Create `frontend/src/components/behavioral/FollowUpGenerator.jsx`
**Requirements**:
```jsx
// Display potential follow-up questions
// Mark as practiced
// Add custom questions
// Practice mode with timer
```

---

### Phase 5: Question Bank Implementation

#### Task 5.1: IC Question Packs
**Status**: PENDING
**File**: Create `backend/seed-ic-questions.js`
**Categories to add**:
- A. Ownership, Impact & Execution (5 questions)
- B. Ambiguity & Problem Solving (5 questions)
- C. Collaboration & Communication (5 questions)
- D. Conflict, Pushback & Influence (5 questions)
- E. Quality, Craft & Reliability (5 questions)
- F. Learning, Feedback & Growth (5 questions)
- G. Product Sense & Customer Focus (5 questions)
- H. Motivation & Culture Fit (4 questions)

#### Task 5.2: EM Question Packs
**Status**: PENDING
**File**: Create `backend/seed-em-questions.js`
**Categories to add**:
- A. Leadership Philosophy & Values (4 questions)
- B. People Management & Performance (5 questions)
- C. Conflict & Difficult Situations (4 questions)
- D. Execution, Planning & Delivery (5 questions)
- E. Cross-Functional Leadership (4 questions)
- F. Hiring & Team Building (4 questions)
- G. Strategy & Technical Leadership (4 questions)
- H. Diversity & Inclusion (3 questions)
- I. Meta & Self-Reflection (4 questions)

#### Task 5.3: Question Metadata Enrichment
**Status**: PENDING
**File**: Create `backend/enrich-question-metadata.js`
**For each question add**:
- signals array
- difficulty level
- applicable roles
- company types
- follow-up questions
- answer tips

---

### Phase 6: Journey Configuration

#### Task 6.1: EM Journey Config
**Status**: PENDING
**File**: Create `backend/journeys/templates/em-journey.json`
**Story slots**:
1. Turning around underperforming team
2. Managing conflict between engineers
3. Cross-org initiative with resistance
4. Hiring/performance decision
5. Org change/strategic pivot

#### Task 6.2: Session Templates
**Status**: PENDING
**File**: Update journey configs
**Add templates**:
- Quick Prep (3 stories, 30 min)
- Standard IC (5 stories, 60-90 min)
- Senior IC (7 stories, 90-120 min)
- EM Standard (5 stories, 90-120 min)

---

### Phase 7: Integration & Polish

#### Task 7.1: Journey Router Integration
**Status**: PENDING
**File**: Update `frontend/src/App.jsx`
**Add routes**:
```jsx
/journey/:journeyId/configure
/journey/:journeyId/story-slots
/journey/:journeyId/story/:slotId
/journey/:journeyId/story/:slotId/practice
/journey/:journeyId/coverage
```

#### Task 7.2: Navigation Updates
**Status**: PENDING
**File**: Update `frontend/src/components/Header.jsx`
**Add**:
- Link to behavioral journey if enrolled
- Badge showing stories completed

#### Task 7.3: Dashboard Integration
**Status**: PENDING
**File**: Update `frontend/src/components/Dashboard.jsx`
**Add**:
- Behavioral journey card with special styling
- Story completion progress
- Next recommended story slot

---

## 🔧 Testing Checklist

### Unit Tests Needed
- [ ] Journey config parser
- [ ] Signal coverage calculator
- [ ] Story completion logic
- [ ] Micro-prompt loader

### Integration Tests Needed
- [ ] Create story flow
- [ ] Update SPARC sections
- [ ] Signal tagging
- [ ] Coverage calculation

### E2E Test Scenarios
- [ ] Complete IC SWE journey setup
- [ ] Write first story (big impact)
- [ ] Tag signals and view coverage
- [ ] Practice 60-second version
- [ ] Complete all 5 required stories

---

## 📝 Documentation Needed

1. **User Guide**: How to use behavioral interview prep
2. **SPARC Framework Guide**: Best practices for each section
3. **Signal Definitions**: What each competency means
4. **API Documentation**: All new endpoints
5. **Config File Spec**: How to create new journeys

---

## 🚀 Deployment Steps

1. Run database migrations
2. Seed behavioral journey
3. Seed question banks
4. Deploy backend changes
5. Deploy frontend changes
6. Test in production
7. Create sample stories for demo

---

## 📊 Success Metrics

- [ ] IC SWE journey fully functional
- [ ] 7 story slots available
- [ ] SPARC framework working
- [ ] Signal coverage visible
- [ ] 60-second compression available
- [ ] 39 IC questions loaded
- [ ] 37 EM questions loaded
- [ ] Navigation seamless
- [ ] Auto-save working
- [ ] Mobile responsive

---

## 🎯 Next Immediate Actions

1. **Fix database tables** - Ensure all tables exist
2. **Run init script** - Create IC SWE journey
3. **Create first API endpoint** - Story slots
4. **Create first component** - StorySlotDashboard
5. **Test basic flow** - Can user see story slots?

Each task above is atomic and can be completed independently by a focused AI agent or developer.