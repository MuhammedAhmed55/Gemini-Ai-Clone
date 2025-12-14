# 🎨 GoatNote Unified Design System

## Overview

A cohesive, professional design system ensuring consistency across all pages and components. Every page follows the same visual language with unified typography, spacing, colors, shadows, and interactions.

---

## 📐 Color Palette

### Primary Brand Colors

```
Primary (Purple/Indigo):    oklch(0.55 0.23 280)
Accent (Cyan/Blue):         oklch(0.65 0.2 260)
Secondary (Orange):         oklch(0.92 0.03 45)
```

### Neutrals

```
Light Background:  oklch(0.98 0.001 0)      - Pure White
Dark Background:   oklch(0.12 0.03 280)     - Deep Navy
Light Text:        oklch(0.15 0.04 280)     - Deep Navy
Dark Text:         oklch(0.95 0.01 0)       - Off-White
```

### Semantic

```
Destructive:       oklch(0.65 0.2 25)       - Red
Border:            oklch(0.92 0.01 280)     - Light Border
Muted:             oklch(0.92 0.01 280)     - Muted Foreground
```

---

## 🎯 Typography

### Headings

| Level              | Size        | Weight | Usage            |
| ------------------ | ----------- | ------ | ---------------- |
| H1 (ds-heading-lg) | 36px (4xl)  | 700    | Page titles      |
| H2 (ds-heading-md) | 30px (3xl)  | 700    | Section headings |
| H3                 | 24px (2xl)  | 600    | Subsections      |
| Body               | 16px (base) | 400    | Default text     |
| Small              | 14px (sm)   | 400    | Captions         |

### Font Stack

```
Primary: Inter (sans-serif)
Fallback: Plus Jakarta Sans
```

---

## 📏 Spacing Scale

```
px-2   = 8px   (compact)
px-4   = 16px  (standard)
px-6   = 24px  (comfortable)
px-8   = 32px  (spacious)

py-2   = 8px   (compact)
py-3   = 12px  (button height)
py-4   = 16px  (standard)
py-6   = 24px  (section)
py-8   = 32px  (page)

gap-2  = 8px   (tight)
gap-3  = 12px  (medium)
gap-4  = 16px  (standard)
gap-6  = 24px  (spacious)
gap-8  = 32px  (sections)
```

---

## 🎴 Component Library

### Cards (ds-card)

```tsx
<div className="ds-card">
  <div className="ds-card-header">Header Content</div>
  <div className="p-6">Card Content</div>
</div>
```

**Features:**

- Rounded corners (xl)
- Subtle border (border/50)
- Consistent shadow (lg)
- Hover effect (shadow-xl)
- Gradient header option

---

### Buttons

#### Primary Button (ds-button-primary)

```tsx
<button className="ds-button-primary px-6 py-2 h-auto">Action</button>
```

**Features:**

- Primary color background
- White foreground text
- Shadow with hover effect
- Smooth transitions

#### Secondary Button (ds-button-secondary)

```tsx
<button className="ds-button-secondary px-6 py-2 h-auto">Secondary</button>
```

**Features:**

- Accent border (2px)
- Accent text color
- Hover background effect
- Smooth transitions

---

### Input Fields (ds-input)

```tsx
<input className="ds-input" placeholder="Enter text..." />
```

**Features:**

- 44px height (touch-friendly)
- Rounded corners (lg)
- Subtle borders
- Focus ring on primary
- Consistent styling

---

### Headings

#### Large Heading (ds-heading-lg)

```tsx
<h1 className="ds-heading-lg">Page Title</h1>
```

#### Medium Heading (ds-heading-md)

```tsx
<h2 className="ds-heading-md">Section Title</h2>
```

---

### Text

#### Muted Text (ds-text-muted)

```tsx
<p className="ds-text-muted">Supporting text</p>
```

---

## 🏗️ Layout Patterns

### Page Container

```tsx
<div className="ds-gradient-bg ds-section-spacing">
  <div className="ds-content-max-width">{/* Content */}</div>
</div>
```

**Features:**

- Full-screen gradient background
- Consistent padding
- Max-width container (max-w-5xl)
- Auto margins

### Sidebar Container

```tsx
<Sidebar className="border-r border-border/30 bg-card">
  <SidebarContent className="custom-scrollbar">{/* Content */}</SidebarContent>
</Sidebar>
```

**Features:**

- Card background
- Subtle right border
- Custom scrollbar styling
- Consistent spacing

---

## 🎨 Design Tokens

### Shadows

```
Shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
Shadow-lg:   0 10px 15px -3px rgba(0,0,0,0.1)
Shadow-xl:   0 20px 25px -5px rgba(0,0,0,0.15)
```

### Border Radius

```
rounded-lg:  8px   (standard)
rounded-xl:  12px  (cards, large elements)
```

### Borders

```
border-border/50:   50% opacity neutral border
border-border/30:   30% opacity neutral border
border-primary/30:  30% opacity primary border
```

---

## 📱 Responsive Design

### Breakpoints

```
Mobile:    default (0px)
Tablet:    sm: 640px
Desktop:   md: 768px
Large:     lg: 1024px
XL:        xl: 1280px
```

### Responsive Patterns

```tsx
/* Mobile-first */
<div className="p-4 md:p-6 lg:p-8">
  {/* Scales with viewport */}
</div>

/* Flex layout */
<div className="flex flex-col sm:flex-row gap-4">
  {/* Stacks on mobile, row on larger screens */}
</div>

/* Grid layout */
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Single column mobile, two on tablet+ */}
</div>
```

---

## 🌓 Dark Mode

All colors automatically adjust based on system preference:

```css
:root {
  /* Light mode colors */
}

.dark {
  /* Dark mode colors */
}
```

**No manual dark variants needed** — use semantic color names like:

- `text-foreground` (light/dark aware)
- `bg-background` (light/dark aware)
- `border-border` (light/dark aware)

---

## ✨ Animation & Transitions

### Fade In (animate-fade-in)

```tsx
<div className="animate-fade-in">Content</div>
```

**Duration:** 0.5s ease-out

### Smooth Transitions

```tsx
<div className="transition-all duration-300">Hover me</div>
```

**Standard durations:**

- 200ms: Quick interactions
- 300ms: Standard transitions
- 500ms: Large animations

---

## 📐 Page Layout Guide

### Dashboard Page

```
┌─────────────────────────────────────┐
│ Header (My Notes)                   │
├─────────────────────────────────────┤
│ Action Buttons (New, Ask AI)        │
├─────────────────────────────────────┤
│                                     │
│  DS-CARD (Editor)                   │
│  ┌─────────────────────────────────┐│
│  │ DS-CARD-HEADER                  ││
│  ├─────────────────────────────────┤│
│  │ Textarea                        ││
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│ Footer (Save Button, Stats)         │
└─────────────────────────────────────┘
```

### Manage Page

```
┌─────────────────────────────────────┐
│ Header (Notes Manager)              │
├─────────────────────────────────────┤
│ Search Bar                          │
├─────────────────────────────────────┤
│ DS-CARD (Table)                     │
│ ┌─────────────────────────────────┐ │
│ │ Table Header                    │ │
│ ├─────────────────────────────────┤ │
│ │ Table Rows                      │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Pagination Controls                 │
└─────────────────────────────────────┘
```

### Ask AI Page

```
┌─────────────────────────────────────┐
│ Header (Ask AI)                     │
├─────────────────────────────────────┤
│ Note Preview (if available)         │
├─────────────────────────────────────┤
│                                     │
│ Chat Messages                       │
│                                     │
├─────────────────────────────────────┤
│ Input Field + Send Button           │
└─────────────────────────────────────┘
```

---

## 🎯 Design Principles

### 1. **Minimalism**

- No unnecessary decorations
- Clean, breathing space
- Focus on content

### 2. **Consistency**

- Same colors, fonts, spacing everywhere
- Predictable patterns
- Unified visual language

### 3. **Clarity**

- Clear information hierarchy
- Readable text
- Obvious interactions

### 4. **Professionalism**

- Refined details
- Smooth transitions
- Polished interactions

### 5. **Accessibility**

- Minimum 44px touch targets
- Good color contrast
- Semantic HTML
- Focus indicators

---

## 🛠️ Usage Examples

### Example: Create a New Page

```tsx
export default function MyPage() {
  return (
    <div className="ds-gradient-bg ds-section-spacing">
      <div className="ds-content-max-width">
        {/* Header */}
        <h1 className="ds-heading-lg mb-2">Page Title</h1>
        <p className="ds-text-muted mb-8">Subtitle or description</p>

        {/* Content Card */}
        <div className="ds-card">
          <div className="ds-card-header">
            <h2 className="ds-heading-md">Section</h2>
          </div>
          <div className="p-6">{/* Content */}</div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button className="ds-button-primary px-6 py-2 h-auto">
            Primary Action
          </button>
          <button className="ds-button-secondary px-6 py-2 h-auto">
            Secondary Action
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Example: Form Component

```tsx
<div className="ds-card">
  <div className="ds-card-header">
    <h2 className="ds-heading-md">Form Title</h2>
  </div>
  <div className="p-6 space-y-4">
    <div className="grid gap-3">
      <label className="text-base font-semibold">Label</label>
      <input className="ds-input" placeholder="Enter text..." />
    </div>
    <button className="ds-button-primary w-full py-2.5 h-auto rounded-lg">
      Submit
    </button>
  </div>
</div>
```

---

## 🔄 Maintenance & Updates

When updating the design:

1. **Update Color Values** in `src/app/globals.css` (`:root` and `.dark`)
2. **Modify Component Classes** in `@layer utilities`
3. **Test Across Pages**: Dashboard, Manage, Ask AI
4. **Test Dark Mode**: Toggle theme and verify
5. **Test Responsiveness**: Mobile, tablet, desktop

---

## 📚 File References

- **Colors & Animations**: `src/app/globals.css`
- **Layout Components**: `src/app/layout.tsx`, `src/app/(app)/layout.tsx`
- **Sidebar**: `src/components/AppSidebar.tsx`, `src/components/SidebarGroupContent.tsx`
- **Dashboard**: `src/app/(app)/dashboard/page.tsx`
- **Manage**: `src/app/(app)/manage/page.tsx`
- **Ask AI**: `src/app/ask-ai/page.tsx`

---

## ✅ Checklist for New Components

- [ ] Use semantic color names (primary, accent, destructive)
- [ ] Apply consistent border-radius (lg or xl)
- [ ] Use design system classes (ds-\*)
- [ ] Maintain 8px spacing grid
- [ ] Include hover/active states
- [ ] Test dark mode
- [ ] Test mobile responsiveness
- [ ] Follow typography scale
- [ ] Use rounded corners consistently
- [ ] Add smooth transitions

---

**This design system ensures GoatNote maintains a professional, cohesive appearance across all pages and features.**
