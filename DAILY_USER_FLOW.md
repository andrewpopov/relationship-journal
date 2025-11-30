# Daily User Flow - Couples Question & Journey Book

## Overview

The new daily experience creates a compelling workflow where couples engage with a daily question, both respond individually, discuss together, and build their shared journey book over time.

---

## ✨ The Complete User Flow

### 1. **Login & Dashboard**

**User Experience:**
- User logs in and lands on an enhanced **Dashboard**
- Dashboard prominently displays:
  - **Today's Question Card** (gradient purple background)
    - Week number & category
    - Question title
    - Main prompt
    - "Start Session" button
  - **Progress Stats** showing:
    - Gratitude streak (with flame icon)
    - Journal entries count
    - Memories count
    - Gratitude notes count
    - Active goals count
  - **Last Entry Preview** (if exists)

**Call to Action:** Click "Start Session" on today's question card

---

### 2. **Daily Question Page** (`/daily-question`)

The heart of the daily experience. A dedicated page for the full question workflow.

#### **Step 1: Your Response**

**User sees:**
- **Progress indicator** at top showing 3 steps:
  1. Your Response ← (current, blue)
  2. Partner Response (gray/waiting)
  3. Discussion (gray/waiting)

- **Question Card** (purple gradient):
  - Week number & category
  - Question title
  - Main prompt
  - Guide questions (expandable list)

- **Your Response Section**:
  - Large textarea for writing
  - "Save Response" button

**User actions:**
1. Reads the question and guide prompts
2. Reflects individually
3. Writes their response (as detailed as they want)
4. Clicks "Save Response"
5. Sees confirmation: "✓ Your response is saved. Waiting for your partner to respond..."

**Status:** Step 1 turns green ✓

---

#### **Step 2: Partner's Response** (Waiting State)

**User Experience:**
- Their response is saved and shown in a read-only view (blue background)
- Message: "Waiting for your partner to respond..."
- Progress shows Step 1 complete ✓
- User can edit their response anytime before discussion

**When Partner Responds:**
- Automatic refresh/reload shows partner's response
- **Partner's Response Section** appears:
  - Pink background card
  - Partner's full response text
  - "Received ✓" badge

**Status:** Steps 1 & 2 turn green ✓

---

#### **Step 3: Joint Discussion**

**Triggers when:** Both partners have submitted their responses

**User sees:**
- **Progress indicator:** All 3 steps showing
- Their response (blue card, read-only)
- Partner's response (pink card, read-only)

- **Joint Discussion Section** (highlighted with purple border):
  - 💫 Banner: "Ready to discuss together!"
  - Instructions: "Now that you've both shared your individual responses, take time to discuss this question together. Share what you learned about each other and record your key takeaways below."
  - Large textarea: "Discussion Notes & Takeaways"
  - "Mark as Discussed & Save" button

**User actions:**
1. Reviews both responses side-by-side
2. Couple discusses the question together (in person/video call)
3. One partner fills in joint discussion notes with:
   - Key takeaways
   - Insights learned
   - Decisions made
   - Meaningful moments from the conversation
4. Clicks "Mark as Discussed & Save"

**Completion:**
- Green success message: "✓ Completed on [date]"
- Call-to-actions appear:
  - "View Journey Book" button (primary)
  - "Back to Dashboard" button (secondary)
- Message: "Great work! This conversation has been added to your Journey Book."

**Status:** All 3 steps green ✓✓✓

---

### 3. **Journey Book** (`/journey-book`)

A beautiful archive of all completed conversations and responses.

#### **Page Header**
- Book icon (64px)
- "Your Journey Book"
- Subtitle: "A collection of your conversations, reflections, and growth as a couple"

#### **Stats Summary**
Three stat cards showing:
1. **X Conversations Completed** (purple)
2. **Y In Progress** (orange)
3. **Z Total Questions** (pink)

#### **Filters**
- **Completed** (default) - Shows only discussed questions
- **In Progress** - Shows questions where 1-2 partners responded but not discussed
- **All** - Shows everything

#### **Question Cards** (Expandable)

**Collapsed View:**
- Week number & category badge
- Status badge ("✓ Discussed" or "1/2 Responses")
- Question title
- Truncated prompt text
- Discussion date (if completed)
- Expand/collapse chevron

**Expanded View:**
- Full question prompt
- Guide questions list
- **Your Responses section:**
  - Your response (blue card)
  - Partner's response (pink card)
- **Discussion Notes section:**
  - Joint notes/takeaways (purple border)
  - Full conversation history

**Sorting:**
- Discussed questions: Newest first (by discussion date)
- In-progress: By week number
- Creates a beautiful chronological journey

---

## 🎯 Key Benefits

### For Users:
1. **Clear Direction** - No confusion about what to do daily
2. **Structure** - Guided 3-step process
3. **Individual Reflection** - Private space before discussion
4. **Side-by-Side Comparison** - See both responses together
5. **Permanent Record** - Journey book preserves all conversations
6. **Progress Tracking** - Visual stats show growth over time

### For the Relationship:
1. **Daily Ritual** - Builds consistency and connection
2. **Deep Conversations** - Structured prompts encourage meaningful dialogue
3. **Growth Tracking** - See how you've evolved over weeks/months
4. **Shared History** - Beautiful archive of your journey together
5. **Intentional Time** - Forces quality couple time

---

## 📱 Navigation Structure

```
Dashboard (/)
  ↓
Daily Question (/daily-question)
  ↓
Journey Book (/journey-book)
  ↑
[Also accessible via top navigation]
```

**Top Navigation Bar:**
- Home
- Journal
- Memories
- Gratitude
- Goals
- Questions (question bank)
- **Journey Book** ← NEW
- Logout

---

## 🔄 User States & Edge Cases

### **No Question Available**
- Empty state with message: "Check back later for your next question!"
- "Back to Dashboard" button

### **First Time User**
- Journey Book shows empty state
- Encouraging message to start answering questions
- Stats show 0/0/X

### **One Partner Answered**
- Shows "Your response saved, waiting for partner..."
- Cannot proceed to discussion
- Can edit own response

### **Discussion Completed**
- All fields become read-only
- Shows completion date
- Can view anytime in Journey Book

---

## 💾 Data Structure

### **Question Response (Individual)**
```javascript
{
  question_id: number,
  user_id: number,
  response_text: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **Question Discussion (Joint)**
```javascript
{
  question_id: number,
  discussed_at: timestamp,
  joint_notes: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

---

## 🎨 Visual Design

### **Color Coding**
- **Your Response**: Blue (`#e3f2fd` background)
- **Partner Response**: Pink (`#fce4ec` background)
- **Joint Discussion**: Purple (`#f3e5f5` background, `#667eea` border)
- **Today's Question Card**: Purple gradient
- **Progress Steps**:
  - Pending: Gray (#f5f5f5)
  - Complete: Green (#e8f5e9)
  - Current: Blue (#e3f2fd)

### **Icons**
- **Daily Question**: MessageCircle
- **Journey Book**: Book
- **Completed**: CheckCircle
- **Individual**: User
- **Both Partners**: Users
- **Discussion**: MessageCircle

---

## 🚀 Recommended Usage Pattern

### **Daily Routine:**
1. **Morning/Afternoon**: Each partner logs in separately and answers the daily question
2. **Evening**: Couple comes together to review and discuss
3. **Before Bed**: Record joint takeaways and mark complete
4. **Weekly**: Browse Journey Book to see progress

### **Weekly Routine:**
1. Review Journey Book on Sundays
2. See all conversations from the week
3. Reflect on patterns and growth
4. Celebrate consistency with streak tracking

---

## 📊 Success Metrics

Track user engagement with:
- Daily login rate
- Question completion rate (both partners answering)
- Discussion completion rate
- Average response length
- Gratitude streak length
- Time between individual responses and discussion
- Journey Book revisit rate

---

## 🔮 Future Enhancements

### **Phase 2 Ideas:**
1. **Notifications**
   - Notify when partner answers
   - Reminder to complete daily question
   - Streak risk warnings

2. **Journey Book Features**
   - Export to PDF
   - Print-friendly format
   - Anniversary highlights
   - Search functionality
   - Tag/categorize conversations

3. **Analytics Dashboard**
   - Conversation trends
   - Most discussed categories
   - Response word clouds
   - Growth timeline visualization

4. **Social Features**
   - Share anonymized insights
   - Community question suggestions
   - Couple testimonials

5. **Gamification**
   - Badges for streaks
   - Milestones (10/25/50/100 questions)
   - "Question of the Month"
   - Couple achievements

---

## 🛠️ Technical Implementation

### **New Components:**
1. `DailyQuestion.jsx` - Main question workflow page
2. `JourneyBook.jsx` - Archive of completed conversations
3. Enhanced `Dashboard.jsx` - Shows today's question prominently

### **New Routes:**
- `/daily-question` - Daily question workflow
- `/journey-book` - Conversation archive

### **API Endpoints Used:**
- `GET /api/questions/today` - Get today's question
- `GET /api/questions/:id/status` - Check response status
- `POST /api/questions/:id/response` - Save individual response
- `POST /api/questions/:id/discuss` - Mark as discussed with notes
- `GET /api/questions` - Get all questions for Journey Book

### **Database Tables:**
- `questions` - Question bank
- `question_responses` - Individual partner responses
- `question_discussions` - Joint discussion records

---

## ✅ Completed Features

- ✅ Enhanced Dashboard with daily question card
- ✅ 3-step Daily Question workflow
- ✅ Individual response submission
- ✅ Partner response viewing
- ✅ Joint discussion notes
- ✅ Journey Book archive
- ✅ Filtering (Completed/In Progress/All)
- ✅ Expandable question cards
- ✅ Progress indicators
- ✅ Status badges
- ✅ Navigation updates
- ✅ Mobile-responsive design
- ✅ Real-time progress tracking

---

## 🎉 User Impact

The new daily flow transforms the app from a collection of separate features into a **cohesive daily relationship ritual** that:

- Gives users a clear, compelling reason to log in every day
- Creates structure for meaningful couple conversations
- Provides visual progress and motivation
- Builds a beautiful, permanent record of growth
- Strengthens relationship bonds through intentional dialogue

This is no longer just a journal app—it's a **relationship growth platform**.
