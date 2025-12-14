# 🎨 Quick Reference - GoatNote Design System

## Color Palette

### Primary Colors

```
Primary: oklch(0.55 0.23 280)    → Purple/Indigo (Main buttons, links)
Accent:  oklch(0.65 0.2 260)     → Cyan/Blue (Highlights, secondary)
Secondary: oklch(0.92 0.03 45)   → Orange (Badges, special)
```

### Neutrals

```
Background (Light): oklch(0.98 0.001 0)      → Pure White
Foreground (Light): oklch(0.15 0.04 280)     → Deep Navy
Background (Dark):  oklch(0.12 0.03 280)     → Deep Navy
Foreground (Dark):  oklch(0.95 0.01 0)       → Off-White
```

---

## Component Examples

### Buttons

**Primary Button**

```html
<button
  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
>
  Action
</button>
```

**Secondary Button**

```html
<button variant="outline" className="border-primary/20 hover:bg-primary/5">
  Secondary
</button>
```

### Cards

**Professional Card**

```html
<Card className="border-border/50 shadow-xl">
  <div className="bg-gradient-to-r from-primary/10 to-accent/5 p-4">Header</div>
  Content
</Card>
```

### Headings

**Page Title**

```html
<h1 className="text-4xl font-bold text-foreground mb-2">My Notes</h1>
```

**Gradient Title**

```html
<h1 className="text-gradient">Professional Title</h1>
```

### Inputs

**Standard Input**

```html
<input className="h-11 rounded-lg border-border/50" />
```

### Backgrounds

**Gradient Background**

```html
<div className="bg-gradient-to-br from-background via-background to-primary/5">
  Content
</div>
```

---

## Utility Classes

| Class                    | Use Case                              |
| ------------------------ | ------------------------------------- |
| `.smooth-gradient`       | Gradient backgrounds with transitions |
| `.glass-effect`          | Frosted glass effect                  |
| `.card-hover`            | Card hover animation                  |
| `.button-hover`          | Button hover effects                  |
| `.custom-scrollbar`      | Styled scrollbar                      |
| `.text-gradient`         | Gradient text                         |
| `.animate-fade-in`       | Fade-in entrance                      |
| `.animate-slide-in-left` | Slide in from left                    |
| `.animate-gradient`      | Animated gradient                     |

---

## Spacing Scale

```
p-4   → 16px padding
p-6   → 24px padding
p-8   → 32px padding
px-4  → 16px horizontal
py-3  → 12px vertical
gap-2 → 8px gap
gap-4 → 16px gap
gap-8 → 32px gap
```

---

## Typography

```
text-4xl → 36px (Large headings)
text-3xl → 30px (Section headings)
text-2xl → 24px (Sub-headings)
text-xl  → 20px (Large text)
text-lg  → 18px (Medium text)
text-base → 16px (Body text)
text-sm  → 14px (Small text)
```

---

## Responsive Breakpoints

```
mobile   → default
sm:      → 640px
md:      → 768px
lg:      → 1024px
xl:      → 1280px
2xl:     → 1536px
```

---

## Common Patterns

### Page Layout

```tsx
<div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
  <div className="max-w-7xl mx-auto px-4 py-8">{/* Content */}</div>
</div>
```

### Form Card

```tsx
<Card className="border-border/50 shadow-xl">
  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5 border-b border-border/50">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="pt-8">{/* Form fields */}</CardContent>
</Card>
```

### Button Group

```tsx
<div className="flex flex-wrap items-center gap-3">
  <Button className="bg-primary hover:bg-primary/90">Primary</Button>
  <Button variant="outline" className="border-border/50">
    Secondary
  </Button>
</div>
```

---

## Dark Mode Support

Colors automatically adjust based on system preference. No need to specify dark variants for:

- `primary` / `accent` / `secondary`
- `foreground` / `background`
- `border` / `input` / `muted`

---

## Animations

### Fade In

```tsx
<div className="animate-fade-in">Content</div>
```

### Smooth Transitions

```tsx
<div className="transition-all duration-300 hover:shadow-lg">Content</div>
```

### Gradient Shift

```tsx
<div className="animate-gradient">Content</div>
```

---

## Performance Tips

1. Use `transition-all` sparingly - be specific when possible
2. Avoid multiple animations on same element
3. Use `will-change` for complex animations
4. Minimize use of `shadow-xl` on mobile
5. Use `overflow-hidden` with rounded corners

---

## Accessibility

- ✅ Color contrast meets WCAG AA standards
- ✅ Button heights minimum 44px (h-11)
- ✅ Input fields clearly labeled
- ✅ Focus states visible
- ✅ Text is readable (16px+ for body)

---

## Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

---

## Files to Reference

- **Colors**: `src/app/globals.css` (line 1-100)
- **Animations**: `src/app/globals.css` (line 100-126)
- **Components**: Individual files in `src/components/`
- **Pages**: Individual files in `src/app/`

---

## Need to Customize?

### Change Primary Color

Edit `src/app/globals.css`:

```css
--primary: oklch(0.55 0.23 280); /* Change these values */
```

### Add New Animation

Edit `src/app/globals.css`:

```css
@keyframes myAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-my-animation {
  animation: myAnimation 0.5s ease-out;
}
```

### Adjust Spacing

Use Tailwind classes:

```html
<!-- More spacing -->
<div className="p-8 gap-6">
  <!-- Less spacing -->
  <div className="p-2 gap-1"></div>
</div>
```

---

**Happy Designing! 🎨**
