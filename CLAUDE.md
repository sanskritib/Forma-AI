# Forma — CLAUDE.md

## What is Forma

Forma is a fictional AI-powered creative tool for generating and refining visual content. This prototype is a take-home design assignment for Luma AI exploring the **iteration loop** — the experience a user has when they receive an AI-generated image and want to direct it toward their creative vision.

The design focus is on two specific moments in that loop:
1. **Evaluate** — helping the user understand what the AI produced
2. **Communicate** — giving the user the right tools to express what they want changed

Steer and final output are byproducts of doing evaluate and communicate well. Do not over-engineer the generation side. The evaluation and communication tooling is the core of what Forma does differently.

This is not a Luma AI redesign. Forma explores a different interaction model for the iteration loop.

---

## Tech Stack

- **Framework:** React
- **Styling:** Tailwind CSS (utility classes only, no custom CSS files unless absolutely necessary)
- **Icons:** Lucide React
- **Font:** Inter (import from Google Fonts)
- **No external UI component libraries** — build components from scratch using Tailwind

---

## Design Tokens

### Colors
```
Canvas background:     #FAF8F6  (warm off-white)
Chat panel bg:         #FFFFFF
Frame active fill:     #F6F8F1  (light green tint)
Frame active border:   #8FB642  (green, 0.5–0.75px)
Frame shadow (green):  rgba(143, 182, 66, 0.5)
Input bg:              #FFFFFF
Input border default:  #F2F2F2 (tertiary) / #F7F7F7 (quaternary)
Apply banner bg:       #F6F8F1
Apply banner border:   #8FB642
Apply banner text:     #5E7A4D
Text primary:          #000000
Text secondary:        #5C5C5C
Text tertiary:         #727272
Text placeholder:      #B4B5B2
Border default:        #E0DED7
Chip bg:               #F8F7F4
Chip border:           #E0DED7
Icon default:          #424242
Button green (dark):   #33411A
```

### Typography (Inter only)

| Style | Size | Weight | Line Height |
|---|---|---|---|
| Title 1 Medium | 22px | 500 | 26px |
| Title 1 Regular | 22px | 400 | 26px |
| Body / Headline | 13px | 400 | 16px |
| Caption | 10px | 400 | normal |

### Spacing
Base unit: 6px. Use multiples: 6, 12, 18, 24, 30.

### Border Radius
- Canvas frames: 12px top-left, top-right, bottom-right — 0px bottom-left (anchored feel)
- Chat panel: 24px on right side corners
- Input box: 12px
- Pills/chips: 15px (rounded-full)
- Small chips / text area: 6px

### Shadows
- Standard (chat panel): `0px 23px 48px 0px rgba(0,0,0,0.1)`
- Frame green glow: `0px 13px 32.7px 0px rgba(143,182,66,0.5)`

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Chat Panel (420px, fixed left, full height)                │
│  Canvas (infinite dot grid, fills remaining width)          │
└─────────────────────────────────────────────────────────────┘
```

### Canvas
- Background: #FAF8F6
- Dot grid: CSS radial-gradient, dots at #E0DED7, 24px spacing
- Cursor becomes `crosshair` when hovering over canvas area
- User click-drags to draw frames
- Drawn frames: fill #F6F8F1, border #8FB642 0.5px, green glow shadow
- Frame corners: 12px top-left, top-right, bottom-right — 0px bottom-left

### Chat Panel
- Fixed left, 420px wide, full viewport height
- White background, 24px padding
- Three sections:
  1. **Top:** Forma logomark (30x30px — simple stylized F in a rounded square as placeholder)
  2. **Middle:** Greeting + chat history (flex-1, scrollable)
  3. **Bottom:** Input box (always visible, never scrolls away)

---

## Screens / States

Use a `demoStep` variable starting at 0. Right arrow key advances to next step.

### Step 0 — Landing (Produce-01)

**Canvas:** Empty dot grid only.

**Chat panel — middle:**
- "Good morning, Martin." — 22px Inter 500, #000000
- "What are we creating today?" — 22px Inter 400, #5C5C5C
- 30px top padding, 6px gap between lines

**Chat panel — bottom input:**
- White card, border #F7F7F7, rounded-12px, height 108px
- Padding: 12px top, 6px bottom, 6px sides
- Placeholder: "Type a brief or draw a frame to start." — 13px Inter 400, #727272
- Bottom row: Plus icon (15px, #424242) left — Mic icon (13px) + CircleArrowUp icon (22px, black filled) right

---

### Step 1 — Frame Drawn + Prompt Written (Produce-02)

**Canvas:** Two frames appear side by side, gap between them.

Each frame:
- 200x200px
- Fill: #F6F8F1
- Border: #8FB642, 0.5px
- Border radius: 12px top-left, top-right, bottom-right — 0px bottom-left
- Green glow shadow: `0px 13px 32.7px rgba(143,182,66,0.5)`

**Frame 1 mini input (empty — user about to type):**
- Flush to bottom of frame, no gap
- White bg, border #8FB642 0.5px, green glow shadow
- Border radius: 0px top-left, 12px top-right, bottom-right, bottom-left
- Padding 6px, gap 18px between rows
- Placeholder: "Reply..." — 10px Inter 400, #B4B5B2, width 141px
- Bottom row: Plus icon (15px) left, CircleArrowUp (22px, black filled) right

**Frame 2 mini input (filled with prompt + image attachment):**
- Same container styling as Frame 1 mini input
- Border: #8FB642 0.5px, green glow shadow
- Padding 6px, gap 12px between rows
- Image thumbnail section (gap 6px between thumbnail and text area):
  - Thumbnail: 25x25px, rounded 2.5px
  - CircleX dismiss icon: 7px, overlapping top-right of thumbnail (left: 21px, top: -3.5px)
- Text area below thumbnail:
  - White bg, border #8FB642 0.5px, rounded 6px, padding 6px
  - Text: "I want to create a brand identity - for an AI trust/security/compliance product. i want to use 16 bit art in combination with cctv camera aesthetic. I want to use the colors in the attached image. ask me clarifying questions to refine this further"
  - 10px Inter 400, #B4B5B2
- Bottom row: Plus icon (15px) left, CircleArrowUp (18px) right

**Chat panel — bottom input in Step 1:**
- "Apply when you are ready" banner sits above the input box:
  - Bg: #F6F8F1
  - Border: #8FB642, 0.75px — top + left + right only
  - Border radius: 12px top-left, top-right — 0px bottom
  - Text: "Apply when you are ready" — 13px Inter 400, #5E7A4D
  - Height: 48px
  - margin-bottom: -14px (overlaps input box below)
- Input box:
  - White bg, border #F2F2F2, rounded-12px, Standard shadow
  - Chip at top: "I want to create a.." — 10px #727272, bg #F8F7F4, border #E0DED7, rounded-full, padding 4px 12px
  - Placeholder below chip: "Describe what you want to create..." — 13px #727272
  - Bottom row: Plus left — Mic (13px) + CircleArrowUp (22px) right

---

## Core Interaction: Drawing a Frame

This is the ONE real working interaction. Build it live, not hardcoded.

1. Cursor enters canvas → becomes `crosshair`
2. Mousedown on canvas → start drawing rectangle from that point
3. Drag → live green-bordered rectangle follows cursor (fill #F6F8F1, border #8FB642 0.5px, green glow)
4. Mouseup → frame finalized at that size/position
5. Mini input box immediately appears attached to bottom of frame
6. Mini input: "Reply..." placeholder, Plus + CircleArrowUp icons

Everything else uses demoStep scripted reveal.

---

## Component Structure

```
/src
  /components
    ChatPanel.jsx       — left panel, all three sections
    Canvas.jsx          — dot grid + draw interaction + frame rendering
    DrawnFrame.jsx      — individual frame card
    MiniInput.jsx       — input attached to bottom of each frame
    ChatInput.jsx       — bottom input in chat panel
    ApplyBanner.jsx     — "Apply when you are ready" banner
  App.jsx               — layout + demoStep state
  main.jsx
index.html
```

---

## Rules for Claude Code

- Tailwind utility classes only — no inline styles, no separate CSS files
- Lucide React for all icons — no emoji as icons
- Inter from Google Fonts — no other typeface
- All colors from token list above — no arbitrary hex values outside this list
- Draw-a-frame interaction is REAL and working — not a scripted reveal
- All other states use demoStep for scripted reveal via right arrow key
- No real images — use gray rounded rectangles + Lucide Image icon as placeholders
- Exception: color palette thumbnail = small striped square (red/orange/green) referencing the palette
- Do not add features not listed here without asking first
- Do not use exact copy strings specified above — no lorem ipsum
- Do not install shadcn, MUI, Radix, or any component library
- Update this CLAUDE.md when any design decision is finalized during the session
