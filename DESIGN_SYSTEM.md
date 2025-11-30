# Relationship Journal - Design System

## Overview

This design system defines the visual language, components, and patterns used throughout the Relationship Journal application. It ensures consistency across all pages and features.

---

## Color Palette

### Primary Colors
```css
--primary: #e91e63        /* Pink - Main brand color */
--primary-dark: #c2185b   /* Darker pink - Hover states */
--secondary: #ff4081       /* Light pink - Accents */
```

### Neutral Colors
```css
--background: #fafafa      /* Light gray - Page background */
--surface: #ffffff         /* White - Card backgrounds */
--text-primary: #212121    /* Dark gray - Main text */
--text-secondary: #757575  /* Medium gray - Secondary text */
--border: #e0e0e0         /* Light gray - Borders */
```

### Semantic Colors
```css
--error: #f44336          /* Red - Errors */
--success: #4caf50        /* Green - Success states */
```

### Feature-Specific Colors
- **Gratitude**: `#f57c00` (Orange) - Used for prompts and highlights
- **Goals Active**: `#1976d2` (Blue) - Active goal status
- **Goals Completed**: `#388e3c` (Green) - Completed goal status

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Type Scale

#### Desktop
- **H1**: 2rem (32px) - Page titles
- **H2**: 1.5rem (24px) - Section headings
- **H3**: 1.25rem (20px) - Card titles
- **Body**: 1rem (16px) - Standard text
- **Small**: 0.875rem (14px) - Dates, metadata

#### Mobile
- **H1**: 1.75rem (28px)
- **H2**: 1.25rem (20px)
- **H3**: 1.1rem (18px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

---

## Spacing System

Consistent spacing scale based on 0.5rem (8px) increments:

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

---

## Components

### Buttons

#### Primary Button
```css
background-color: #e91e63
color: white
padding: 0.75rem 1.5rem
border-radius: 6px
min-height: 44px (mobile)
```

**Use for**: Main actions (Create, Submit, Save)

#### Secondary Button
```css
background-color: #757575
color: white
padding: 0.75rem 1.5rem
border-radius: 6px
```

**Use for**: Secondary actions (Cancel, Browse, etc.)

#### Icon Button
```css
background: transparent
padding: 0.5rem
border-radius: 50%
color: #757575
hover: background: #fafafa, color: #e91e63
```

**Use for**: Edit, Delete, Close actions

#### Floating Action Button (FAB)
```css
position: fixed
bottom: 2rem (1rem on mobile)
right: 2rem (1rem on mobile)
width: 56px
height: 56px
border-radius: 50%
background-color: #e91e63
color: white
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
```

**Use for**: Quick add functionality on list pages

### Cards

#### Standard Card
```css
background-color: white
border-radius: 12px
padding: 1.5rem (1rem on mobile)
margin-bottom: 1rem
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
hover: transform: translateY(-2px), box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
```

**Use for**: Content containers, list items

#### Highlight Card (Gratitude Prompt)
```css
background-color: #fff3e0
padding: 1.5rem
border-radius: 12px
```

**Use for**: Special prompts, featured content

### Forms

#### Input Fields
```css
width: 100%
padding: 0.75rem
border: 1px solid #e0e0e0
border-radius: 6px
font-size: 1rem (16px on mobile to prevent zoom)
focus: border-color: #e91e63
```

#### Textarea
```css
min-height: 100px
resize: vertical
```

#### Labels
```css
display: block
margin-bottom: 0.5rem
color: #757575
font-size: 0.9rem
font-weight: 500
```

### Modals

#### Modal Overlay
```css
position: fixed
inset: 0
background-color: rgba(0, 0, 0, 0.5)
z-index: 1000
padding: 1rem
```

#### Modal Container
```css
background-color: white
border-radius: 12px
padding: 2rem (1.5rem on mobile)
max-width: 500px
max-height: 90vh (85vh on mobile)
overflow-y: auto
```

#### Modal Actions
```css
display: flex
gap: 1rem
margin-top: 1.5rem
flex-direction: row (column on mobile)
```

### Navigation

#### Nav Link
```css
color: #757575
text-decoration: none
padding: 0.5rem 1rem (0.5rem 0.75rem on mobile)
border-radius: 6px
display: flex
align-items: center
gap: 0.5rem

active: color: #e91e63, background: #fce4ec
hover: color: #e91e63, background: #fce4ec
```

### Empty States

#### Standard Empty State
```html
<div className="empty-state">
  <Icon size={64} color="[feature-color]" strokeWidth={1.5} />
  <h2>No [Items] Yet</h2>
  <p>Helpful description of what to do next</p>
  <button className="btn-primary">
    <Plus size={20} />
    [Primary Action]
  </button>
</div>
```

**Elements**:
- Large icon (64px) in feature color
- Heading (H2)
- Descriptive text
- Primary call-to-action button

**Examples**:
- **Memories**: Camera icon (#e91e63) + "Add Your First Memory"
- **Goals**: Target icon (#388e3c) + "Set Your First Goal"
- **Gratitude**: Sparkles icon (#f57c00) + Prompt card with button

---

## Layouts

### Container
```css
max-width: 1200px
margin: 0 auto
padding: 1rem (0.75rem on mobile)
```

### Grid Layout
```css
display: grid
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
gap: 1rem

mobile: grid-template-columns: 1fr
tablet: grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
```

**Use for**: Memories, Dashboard cards

---

## Icons

Using **Lucide React** icon library

### Size Guidelines
- **Navigation**: 20px
- **Buttons**: 18-20px
- **Empty States**: 64px
- **Feature Icons**: 20-24px
- **FAB**: 24px

### Common Icons
- **Plus**: Add/Create actions
- **Edit2**: Edit functionality
- **Trash2**: Delete actions
- **X**: Close modals
- **Heart**: Branding/Love
- **BookOpen**: Journal
- **Camera**: Memories
- **Target**: Goals
- **Sparkles**: Gratitude
- **Lightbulb**: Questions/Prompts

---

## Authentication Pages

### Auth Container
```css
min-height: 100vh
display: flex
align-items: center
justify-content: center
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

### Auth Card
```css
background: white
padding: 2rem (1.5rem on mobile)
border-radius: 12px
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1)
max-width: 400px
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px)

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px)

/* Desktop */
@media (min-width: 1025px)
```

### Mobile Considerations
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Font Size**: Inputs use 16px to prevent iOS zoom
- **Modals**: Stack action buttons vertically
- **Navigation**: Wrap and center nav links
- **FAB**: Position at 1rem from edges (instead of 2rem)

---

## Shadows

### Card Shadow
```css
default: 0 2px 8px rgba(0, 0, 0, 0.1)
hover: 0 4px 12px rgba(0, 0, 0, 0.15)
```

### Auth Card Shadow
```css
0 10px 40px rgba(0, 0, 0, 0.1)
```

### FAB Shadow
```css
0 4px 12px rgba(0, 0, 0, 0.3)
```

---

## Animations & Transitions

### Standard Transitions
```css
transition: all 0.2s ease
```

### Hover Effects
- **Cards**: `transform: translateY(-2px)` + enhanced shadow
- **Buttons**: Background color change
- **FAB**: `transform: scale(1.1)`
- **Icon Buttons**: Background color + text color change

---

## Status Badges

### Goal Status
```css
display: inline-block
padding: 0.25rem 0.75rem
border-radius: 12px
font-size: 0.875rem
font-weight: 500
```

**Active**:
```css
background-color: #e3f2fd
color: #1976d2
```

**Completed**:
```css
background-color: #e8f5e9
color: #388e3c
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary color (#e91e63) on white: 4.5:1 ratio
- Text primary (#212121) on white: 16:1 ratio

### Focus States
```css
outline: none (custom)
border-color: var(--primary)
```

### Interactive Elements
- All buttons have min-height of 44px on mobile
- Icon buttons have padding for larger tap targets
- Hover states provide visual feedback

---

## Best Practices

### Do's ✓
- Use consistent spacing from the spacing scale
- Apply hover states to all interactive elements
- Use semantic colors (success, error) appropriately
- Maintain minimum 44px touch targets on mobile
- Use icon + text for primary actions when possible
- Keep empty states helpful with clear CTAs

### Don'ts ✗
- Don't use arbitrary spacing values
- Don't mix button styles inconsistently
- Don't forget mobile-specific optimizations
- Don't create touch targets smaller than 44px
- Don't use text-only buttons for critical actions
- Don't leave empty states without action buttons

---

## Component Checklist

When creating new components, ensure:
- [ ] Responsive on mobile (< 768px), tablet (769-1024px), desktop (> 1025px)
- [ ] Proper spacing using the scale
- [ ] Hover and active states defined
- [ ] Loading states implemented (where applicable)
- [ ] Empty states with helpful messaging and CTAs
- [ ] Error states with clear messaging
- [ ] Accessibility considerations (focus, contrast, labels)
- [ ] Consistent with existing patterns
- [ ] Icons from Lucide React library
- [ ] Touch-friendly on mobile (44px minimum)

---

## Version History

- **v1.0** - Initial design system (2025-11-27)
  - Core color palette
  - Component library
  - Responsive guidelines
  - Mobile optimizations
