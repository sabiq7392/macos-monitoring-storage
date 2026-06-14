# Design System

## Junk-Detector

---

## 1. Design Philosophy

Junk-Detector menggunakan pendekatan **"Cybernetic Minimalism"** — perpaduan dark mode dengan accent teal/purple yang glowing, memberikan kesan futuristik namun tetap clean dan readable.

---

## 2. Color Palette

### Primary Colors
```css
--color-brand-teal: #2dd4bf;      /* Primary accent */
--color-brand-purple: #a78bfa;    /* Secondary accent */
```

### Background & Surface
```css
Background: #0f172a (slate-900)
Surface: rgba(255, 255, 255, 0.05)
Surface Hover: rgba(255, 255, 255, 0.10)
Border: rgba(255, 255, 255, 0.10)
```

### Category Colors

| Category | Color | Hex |
|----------|-------|-----|
| Node.js | Teal | `#2dd4bf` |
| Python | Purple | `#a78bfa` |
| Developer/macOS | Blue | `#60a5fa` |
| Editor | Orange | `#fb923c` |
| AI | Pink | `#f472b6` |
| Leftover App | Yellow | `#fbbf24` |
| Hidden File | Fuchsia | `#e879f9` |
| All | Slate | `#94a3b8` |

### Semantic Colors
```css
Success: teal-400 (#2dd4bf)
Danger: red-500 (#ef4444)
Warning: amber-500 (#f59e0b)
Info: blue-500 (#3b82f6)
```

---

## 3. Typography

### Font Family
```css
font-family: 'Outfit', sans-serif;
-webkit-font-smoothing: antialiased;
```

### Type Scale

| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| H1 (Total Cache) | 4xl–5xl | Black (900) | Tight |
| H2 (Section Title) | lg | Bold (700) | Tight |
| H3 (Card Title) | xs | Semibold (600) | Normal |
| Body | sm | Normal (400) | Normal |
| Caption | xs | Normal (400) | Normal |
| Label | [10px] | Bold (700) | 0.2em |
| Badge | [9px] | Bold (700) | 0.1em |

---

## 4. Spacing System

Menggunakan Tailwind default spacing scale (4px base):

```
2  = 0.5rem = 8px
3  = 0.75rem = 12px
4  = 1rem = 16px
5  = 1.25rem = 20px
6  = 1.5rem = 24px
8  = 2rem = 32px
10 = 2.5rem = 40px
12 = 3rem = 48px
```

---

## 5. Component Patterns

### Card
```css
Base:
  rounded-2xl
  border border-white/10
  bg-white/5
  backdrop-blur-md
  shadow-xl

Hover:
  hover:border-white/20
  hover:bg-white/10
  hover:-translate-y-0.5

Active:
  border-{color}
  bg-{color}/8
```

### Button (Primary)
```css
Base:
  rounded-full
  bg-gradient-to-r from-teal-400 to-emerald-400
  text-slate-900
  font-black uppercase tracking-wider
  text-xs md:text-sm
  px-12 py-3.5

Hover:
  hover:from-teal-300 hover:to-emerald-300
  hover:-translate-y-0.5
  hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]

Disabled:
  disabled:opacity-40
  disabled:cursor-not-allowed
```

### Button (Icon)
```css
Base:
  w-9 h-9
  rounded-full / rounded-lg
  bg-{color}/10
  border border-{color}/30
  text-{color}

Hover:
  hover:border-{color}/80
  hover:bg-{color}
  hover:text-white
```

### Badge
```css
Base:
  px-2 py-0.5
  rounded-full
  text-[9px] font-bold tracking-wider uppercase
  border
  bg-{color}/15 text-{color} border-{color}/30
```

### Progress Bar
```css
Track:
  w-full h-1 (card) / h-2 (loading)
  bg-white/10
  rounded-full

Fill:
  h-full
  bg-gradient-to-r from-teal-400 to-teal-300
  rounded-full
  shadow-[0_0_12px_rgba(45,212,191,0.5)]
  transition-all duration-300/500
```

---

## 6. Layout

### Grid System
```css
Dashboard:
  grid grid-cols-1 md:grid-cols-2
  Left column: md:col-span-5
  Right column: md:col-span-7
  gap-6
  max-w-7xl mx-auto
  p-6

Category Cards:
  grid grid-cols-2
  gap-3
```

### Container
```css
max-w-7xl mx-auto
p-6 (desktop)
p-8 md:p-12 (welcome)
```

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

---

## 7. Animation & Motion

### Timing Functions
```css
duration-150  /* Micro interactions */
duration-200  /* Standard transitions */
duration-300  /* Emphasized transitions */
duration-500  /* Progress bars */
```

### Keyframes
```css
animate-spin       /* Spinner, orbit rings */
animate-pulse      /* Glowing dots, status indicators */
animate-[spin_20s_linear_infinite]        /* Slow orbit */
animate-[spin_10s_linear_infinite_reverse] /* Reverse orbit */
```

### Transform
```css
hover:-translate-y-0.5   /* Lift on hover */
active:translate-y-0     /* Press on active */
```

---

## 8. Iconography

Menggunakan emoji sebagai ikon utama:

| Emoji | Context |
|-------|---------|
| ⚡ | Main logo / energy |
| 💻 | Developer Cache mode |
| 🗑️ | Leftover / Clean action |
| 👁️ | Hidden Files mode |
| ↻ | Refresh / Rescan |
| ✓ | Success / Checkmark |
| ⏳ | Loading state |

---

## 9. Shadows & Effects

### Glow Effects
```css
Teal glow:  shadow-[0_0_20px_rgba(45,212,191,0.3)]
Strong glow: shadow-[0_0_30px_rgba(45,212,191,0.4)]
Subtle glow: shadow-[0_0_15px_rgba(45,212,191,0.05)]
```

### Backdrop Blur
```css
backdrop-blur-md   /* Cards, header */
backdrop-blur-xl   /* Welcome screen */
backdrop-blur-sm   /* Badges */
```

### Radial Gradients
```css
/* Top glow */
bg-[radial-gradient(ellipse_at_0%_0%,rgba(45,212,191,0.12),transparent_60%)]

/* Center glow */
bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,0.15),transparent_70%)]
```

---

## 10. Accessibility

### Focus States
- Semua interactive elements memiliki visible focus
- Category cards support keyboard navigation (Enter key)

### Contrast
- Text: white/slate-400 on dark background (high contrast)
- Buttons: dark text on bright teal (high contrast)

### Touch Targets
- Buttons minimum 36x36px (w-9 h-9)
- Cards full-width clickable area

### Screen Reader
- Semantic HTML (button, ul/li)
- role="button" dan tabIndex pada div clickable
- title attributes pada truncated text
