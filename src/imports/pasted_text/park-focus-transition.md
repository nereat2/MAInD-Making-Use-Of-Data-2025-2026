# Figma Make Prompt — verde_lugano Block 2
## Individual Park Exploration — Word Network Interface

---

## REFERENCE TO BLOCK 1 AESTHETIC

Continue using the design system established in Block 1 (title screen + map view):
- Typography: Helvetica Neue, weight 300 for display, weight 400 for labels, weight 500 for data
- Color: Pure white background `#FFFFFF`, all UI in black/gray at low opacity
- Category color palette (locked):
  - experiential_emotional: `#C4A8FF` (lavender)
  - sensory_environmental: `#40FFB8` (mint)
  - action: `#52E8FF` (cyan)
  - relational_context: `#FFE040` (yellow)
  - tension_complaint: `#FF7060` (coral)
  - infrastructure_amenities: `#FFB47A` (peach)
- Spacing: generous whitespace, 48px minimum margins
- No shadows, no rounded containers, only 0.5px divider lines

---

## SCREEN 1 — PARK FOCUS TRANSITION

This is the bridge animation from the map view (Block 1, Screen 2) to the word network.

**Trigger:** User clicks on a park aura blob on the map.

**Animation sequence (total duration: 3.5–4 seconds):**

### Phase 1: Zoom to park (0–1000ms)
- Camera zooms to center the selected park aura on screen
- All other park auras fade out completely (opacity → 0)
- The selected aura grows from its map size to ~400px diameter
- Lake silhouette and street grid fade out (opacity → 0)
- Top-left "verde_lugano" label remains visible but shrinks to 14px

### Phase 2: Park context appears (1000–1500ms)
Park metadata fades in, centered above the aura:
```
[Park name — 28px, weight 300, centered]
Parco Ciani

[Metadata line — 11px, weight 400, tracked uppercase, color: rgba(80,80,80,0.44), centered]
292 REVIEWS · 156 UNIQUE WORDS
```

### Phase 3: Full-screen aura immersion (1500–2500ms)

**CRITICAL — this is the new behavior:**

The aura blob **expands to fill the entire viewport**. Not inside an outline, not bounded by anything — the multi-color gradient blob becomes a full-bleed immersive screen, edge to edge.

**How to render this:**
- The aura is a single massive circular gradient mesh (same technique as map view but scaled to ~1800px diameter on a 1440px viewport)
- The circle is positioned so its center is at viewport center, meaning the edges of the circle extend beyond the screen boundaries
- The result: the user sees only the **interior of the gradient** — pure color blending, no white background visible, no shape boundaries
- All 6 category colors are present and blending into each other using the same radial gradient layering technique from the map
- The blob has a very slow pulse animation (scale 1.0 → 1.02 → 1.0, 4s cycle, ease-in-out)
- The colors appear to gently shift/breathe as internal gradient spots drift slightly (±3% position change, 8s cycle)

**What's visible during this phase:**
- Full-screen color gradient (the aura)
- Park name + metadata (still centered, now in white or very light text for contrast against colors)
- Nothing else — no map, no outline, no UI chrome

**Reference:** The attached inspiration image shows this effect — a seamless multi-color gradient blob filling the frame.

### Phase 4: Transition to word network (2500–3500ms)

The full-screen aura **dissolves into the word network**:

1. **Category zones emerge (2500–3000ms):**
   - The massive color blob begins to contract and segment
   - 6 distinct **circular blob zones** form, one per category, each in its category color
   - These blobs are sized proportionally to category weight:
     - Largest blob (experiential 46%): ~280px diameter
     - Smallest blob (tension 1%): ~80px diameter
   - The blobs arrange themselves spatially across the screen to roughly divide the viewport into 6 territories
   - Each blob maintains soft edges (radial gradient fade to white at edges)
   - The blobs overlap slightly at their edges, creating natural color blending zones

2. **Words materialize from blobs (3000–3500ms):**
   - As each category blob settles into position, **words begin appearing from within it**
   - Each word emerges from its category's blob in that category's color
   - Words drift outward from the blob center to their final network positions
   - Word opacity: 0 → 1 over 400ms, with staggered timing (larger/more frequent words appear first)
   - As words settle, the category blobs fade to **very low opacity background washes** (3–5% opacity of category color)
   - The blobs become **zone markers** rather than dominant visual elements

3. **Final network state appears (3500ms):**
   - All words visible in white/light gray (default state)
   - Category blob backgrounds barely visible (3% opacity color washes)
   - Soft boundary lines between category zones appear (0.5px, `rgba(0,0,0,0.08)`)
   - Top bar, legend, search, and all UI chrome fade in (0 → 1 opacity, 300ms)

**Dev note:** The word network layout (positions and connections) should be pre-calculated before the transition starts. Words need to know where they're "traveling to" when they emerge from the blobs.

---

## SCREEN 2 — WORD NETWORK (Main Exploration View)

This is the core interface where users explore the park's vocabulary.

### Canvas dimensions
- Desktop: 1440×900px (standard viewport)
- The word network occupies the full viewport except for UI chrome
- Top bar: 72px tall (sticky)
- Bottom margins: 60px (for legend and reflection prompt)
- Working canvas for word network: ~768px vertical space

### Layout structure — 6 category zones

The screen is divided into **6 territorial zones**, one per category. Each zone's size is proportional to that category's weight in the park.

**Zone calculation example (for Parco Ciani):**
| Category | Weight | Approximate area |
|---|---|---|
| experiential_emotional | 46% | Largest zone, center-left |
| action | 20% | Large zone, upper-right |
| sensory_environmental | 18% | Large zone, lower-right |
| infrastructure_amenities | 10% | Medium zone, upper-left |
| relational_context | 5% | Small zone, lower-left |
| tension_complaint | 1% | Tiny zone, edge/corner |

**How zones are marked:**
- Each zone has a **faint circular blob background** — the blob from the transition, now at 3–5% opacity of its category color
- Zone boundaries are soft curved lines (0.5px stroke, `rgba(0,0,0,0.08)`)
- Boundaries are organic/hand-drawn feeling, not geometric — use bezier curves with slight irregularity
- The zones should feel like territories on a map, not cells in a spreadsheet

**Zone positioning:**
- Larger zones (>20% weight) claim central positions
- Smaller zones (<5% weight) push toward edges
- Zones should not feel cramped — if a zone is <5%, give it at least 120×120px of space

### Word placement and sizing

**Word positioning:**
- Use **force-directed graph layout** within each category zone
- Each word is a node that:
  - Repels other words to avoid overlap (repulsion force inversely proportional to distance)
  - Is attracted to words it co-occurs with (attraction force proportional to co-occurrence strength)
  - Cannot cross its zone boundary (boundary acts as a soft constraint)
- The result is an organic scatter where related words cluster together

**Word sizing:**
- Size is determined by frequency (number of times the word appears in the park's reviews)
- Logarithmic scale to prevent extreme size differences:
  ```
  font_size = 11 + 21 * (log(word_frequency) / log(max_frequency_in_park))
  ```
- Minimum: 11px (words appearing 2–4 times)
- Maximum: 32px (most frequent word in the park)
- Example for Parco Ciani:
  - "beautiful" (freq 292) → 32px
  - "relaxing" (freq 87) → 26px
  - "fountain" (freq 34) → 22px
  - "overgrown" (freq 3) → 12px

**Word styling (default state — no hover):**
- Color: `#F8F8F8` (very light gray, almost white)
- Font: 'Helvetica Neue', weight 400
- No text shadow, no effects
- Letter-spacing: 0.02em
- The interface feels quiet and neutral — color only appears on interaction

### Connection lines (co-occurrence edges)

**When visible:** Only on hover (see Hover State below)

**Data source:** Each word has up to 3 co-occurring terms stored in the dataset (`co_occurring_term_1`, `co_occurring_term_2`, `co_occurring_term_3`)

**Visual style:**
- Line width: 0.8px
- Color: `rgba(0,0,0,0.25)`
- Line type: Bezier curve (quadratic or cubic)
  - Start point: center of hovered word
  - End point: center of connected word
  - Control point: midpoint between them, offset perpendicular by 15% of distance (creates gentle arc)
- Lines can cross zone boundaries — this is important; seeing "beautiful" (experiential) connected to "playground" (infrastructure) is meaningful
- Lines should render **behind** words (lower z-index)

### Top bar (sticky, always visible)

```
[Left side — 48px from edge]
← All parks
[14px, weight 400, color: rgba(40,40,40,0.60)]

[Center]
Parco Ciani
[28px, weight 300, color: rgba(15,15,15,0.85)]

292 REVIEWS · 156 UNIQUE WORDS
[11px, weight 400, tracked uppercase, color: rgba(80,80,80,0.44)]

Mostly described as emotional and sensory
[13px, weight 300, italic, color: rgba(40,40,40,0.55)]

[Right side — layout as flexbox row with gap 20px]
[Aura thumbnail — 48px diameter, same gradient as map view, subtle drop shadow]
[Search field — 220px wide, 32px tall, background: rgba(0,0,0,0.04), border-radius: 4px]
  placeholder: "Find a word..."
  [11px, weight 400]
```

**Personality summary generation:**
The "Mostly described as..." line is auto-generated from the two dominant categories:
- Template: `Mostly described as {category_1_adjective} and {category_2_adjective}`
- Category adjectives:
  - experiential_emotional → "emotional"
  - sensory_environmental → "sensory"
  - action → "a place to move and play"
  - relational_context → "social and relational"
  - tension_complaint → "with noted concerns"
  - infrastructure_amenities → "by its facilities"
- Examples:
  - Ciani (exp 46%, action 20%) → "Mostly described as emotional and a place to move and play"
  - Lambertenghi (exp 27%, relational 27%) → "Equally emotional and social in character"
  - If one category >60%: "Strongly {category} in character"

### Persistent legend (bottom-right corner)

```
[Fixed position: right 48px, bottom 80px]
[Vertical stack, gap 10px between items]

● experiential_emotional
● sensory_environmental
● action
● relational_context
● tension_complaint
● infrastructure_amenities

[Each line: 10px, weight 400, color: rgba(60,60,60,0.48)]
[Dot: 7px diameter, filled with category color at 85% opacity]
```

**Interaction:**
- Each category name is clickable/tappable
- Click behavior:
  - **First click:** Filter mode activates
    - Only words in that category remain visible and colored
    - All other words fade to 5% opacity
    - Category name in legend becomes bold (weight 500)
    - Other category names dim to 25% opacity
  - **Second click (on same category):** Returns to default state (all words white)
  - **Click different category:** Switches filter to new category
- Hover over category name: all words in that category get a subtle glow/highlight (even in default state)

### Tooltip (bottom-left corner, fixed position)

**Position:** left 48px, bottom 80px (same vertical alignment as legend)

**Trigger:** Mouse hover over any word

**Content structure:**
```
[Category indicator — color swatch 8px circle + name]
● experiential_emotional
[10px, weight 400, gap 6px between dot and text]

beautiful
[24px, weight 300, color: category color at full saturation]

mentioned 292 times
[11px, weight 400, color: rgba(60,60,60,0.50)]

[Divider — 32px wide, 0.5px, margin 12px vertical]

"Un posto bellissimo con una vista mozzafiato sul lago."
[13px, weight 300, italic, line-height 1.65, color: rgba(30,30,30,0.60)]
[Max 2 lines, truncate with ellipsis if longer]

Connected to: peaceful, relaxing, magical
[11px, weight 400, color: rgba(80,80,80,0.45)]
```

**Styling:**
- Container: padding 16px, background `rgba(255,255,255,0.98)`, border 0.5px solid `rgba(0,0,0,0.10)`, border-radius 6px
- Max width: 320px
- Drop shadow: subtle, `0 2px 8px rgba(0,0,0,0.08)`
- The tooltip should feel like a floating card, not attached to the hovered word

**Animation:** Fade in 150ms ease when hover starts, fade out 100ms when hover ends

### Search field behavior

**Location:** Top-right corner of top bar

**Functionality:**
- As user types, matching words in the network **highlight** (color → category color, scale 1.15x)
- Non-matching words fade to 10% opacity
- If exact match found, camera pans/zooms slightly to center that word on screen
- Clear button (×) appears when field has text

**Styling:**
- Background: `rgba(0,0,0,0.04)`
- Border: 0.5px solid `rgba(0,0,0,0.08)` on focus
- Text: 11px, weight 400
- Placeholder color: `rgba(100,100,100,0.40)`

### Hover state (detailed interaction specification)

When mouse enters a word:

**1. The hovered word:**
- Scale: 1.0 → 1.1 (smooth, 150ms ease-out)
- Color: light gray → full saturation of category color
- Add subtle drop shadow: `0 2px 6px rgba(0,0,0,0.15)`

**2. All words in the same category:**
- Color: white/gray → category color at 85% opacity
- No scale change
- This creates a visual "lighting up" of the entire category zone

**3. Words in other categories:**
- Remain in default state (white/light gray)
- Optionally: reduce to 40% opacity for stronger contrast (user testing needed to see which feels better)

**4. Connection lines appear:**
- Draw lines from hovered word to all its co-occurring words (up to 3 connections per word)
- Line style as specified above (0.8px bezier curves, `rgba(0,0,0,0.25)`)
- Lines animate in: draw from hovered word outward to connected word over 200ms
- If a connected word is in a different category, the line crosses zone boundaries — this visual creates the "debate moment"

**5. Connected words highlight:**
- Even if they're in different categories, connected words also receive subtle highlight (scale 1.05x, slight glow)

**6. Tooltip appears:**
- Fixed position bottom-left corner (content specified above)
- Fades in 150ms after hover starts
- Content updates instantly when hovering different words

**7. Category zone background brightens:**
- The faint circular blob background for the hovered word's category brightens from 3% opacity to 12% opacity
- This reinforces which territory you're exploring

### Click state (for mobile/touch, optional)

- **Tap a word:** Locks the hover state
- **Tap outside or tap another word:** Releases lock
- Visual indicator when locked: small pin icon appears next to word (8px)

This allows touch users to read the tooltip without fighting hover instability.

### Reflection prompt (bottom center edge)

**Position:** bottom 20px, centered horizontally

**Content:** A single question, rotates on page load (pick randomly from this list):
- "What word surprises you?"
- "What's missing from this picture?"
- "Whose park is this — visitors' or residents'?"
- "Would you use these words?"
- "What word would you add?"

**Styling:**
- 11px, weight 300, italic
- Color: `rgba(80,80,80,0.30)`
- No background, no container
- Feels like a whisper, not a label

---

## SCREEN 3 — EMPTY STATE (for Parco Lambertenghi)

Parco Lambertenghi has only 65 total word instances in reviews, meaning very few words will appear in the network (words must appear ≥2 times to be included).

**What to show:**
- The word network layout as normal, but with only ~20–26 words visible
- Large empty zones where categories have no qualifying words
- Category zone backgrounds still present (the faint blob washes) even if empty

**Special annotation** appears in the center of the largest empty area:

```
[Centered content block, max-width 280px]

Only 26 words appear more than once
in this park's reviews.

Lambertenghi is small.
Its review trail is small too.

Notice what's not here.

[13px, weight 300, italic, line-height 1.75, color: rgba(40,40,40,0.50)]
```

**Purpose:** Turn data sparseness into a conversation prompt rather than hiding it or apologizing for it.

---

## SCREEN 4 — NEXT PARK BRIDGE

After user scrolls past the word network (or after ~2 minutes of idle time), a transition panel appears at the bottom:

```
[Centered panel, max-width 500px, padding 60px vertical]

[Divider — 48px wide, 0.5px, color: rgba(0,0,0,0.15), centered, margin-bottom 24px]

Ready to see another park?

[18px, weight 300, centered]

[Two buttons in horizontal row, gap 16px, margin-top 32px]

[Button 1 — outline style]
← Explore another park
[11px, weight 400, tracked uppercase, padding 10px 20px]
[Border: 0.5px solid rgba(0,0,0,0.30), border-radius 2px]

[Button 2 — filled style]
Compare all five →
[11px, weight 500, tracked uppercase, padding 10px 20px]
[Background: rgba(0,0,0,0.85), color: white, border-radius 2px]
```

**Button behaviors:**
- "Explore another park" → returns to map view (Block 1, Screen 2)
- "Compare all five" → advances to Screen 5 (comparison view)

**Important:** Don't auto-trigger comparison. Let it be a deliberate user choice.

---

## SCREEN 5 — COMPARISON VIEW

**Layout:** 5 park auras displayed in a horizontal row, evenly spaced.

```
[Full viewport, centered content]

[Title — top, centered, margin-bottom 48px]
Five parks, five portraits
[28px, weight 300]

[Aura row — 5 auras, each 180px diameter, gap 40px between them]

[Below each aura, centered:]
Park name
[14px, weight 400, margin-top 16px]

Top 3 words (stacked vertically, gap 4px)
[11px, weight 400, each word in its category color]
```

**Aura rendering:**
Each aura uses the same multi-color circular blob technique from the map, sized to 180px diameter. Same color proportions, same gradient mesh approach.

**Word lists:**
The 3 most frequent words from each park's reviews, each displayed in its category color.

Example:
```
Parco Ciani          Parco Tassino       Parco San Michele
beautiful            peaceful            view
relaxing             green               beautiful
magical              walking             quiet
```

**Closing reflection (below the row, centered):**

```
[Content block, max-width 500px, margin-top 80px]

[14px, weight 300, line-height 1.75, color: rgba(30,30,30,0.65)]

What does your favorite park's aura look like?

What about the one closest to your home?

[Margin-top 60px]
```

---

## SCREEN 6 — CLOSING & COMMUNITY INPUT

```
[Centered content, max-width 600px]

[Divider — 48px wide, 0.5px, margin-bottom 40px]

Three questions to think about:

[16px, weight 300, margin-bottom 20px]

· Does the aura match your experience of the park?
· What language is missing from these reviews?
· Who gets to define what a public space feels like?

[14px, weight 300, line-height 1.85, color: rgba(30,30,30,0.60)]
[Each question prefixed with ·, gap 12px between questions]

[Divider — margin-top 60px, margin-bottom 40px]

[Optional community input section]

What word would you add?

[12px, weight 300, margin-bottom 12px, color: rgba(60,60,60,0.55)]

[Text input field — full width, 44px tall]
[Background: rgba(0,0,0,0.03), border: 0.5px solid rgba(0,0,0,0.10)]
[Placeholder: "Type a word..."]

Your input will be shared with the group
[10px, weight 400, color: rgba(100,100,100,0.40), margin-top 8px]

[Divider — margin-top 80px, margin-bottom 40px]

[Credits section]

A project by [Student Names]

SUPSI · MAIND
Visual Communication Studio 2025
Professors: [Names]

[11px, weight 400, tracked uppercase, line-height 1.8]
[Color: rgba(80,80,80,0.44)]
```

**Community input mechanics:**
- Single-line text input
- No validation, no character limits
- Submit button appears when field has text: "Add word →" [11px, weight 500]
- On submit: field clears, confirmation message appears briefly: "Thank you. Your word has been recorded."
- Backend: simple POST to append to a shared log/spreadsheet for facilitator review
- No display back to user — this is purely for group facilitation, not a public feed

---

## DATA REQUIREMENTS

For Figma Make to build this correctly, provide the following data structure:

**Per park:**
```json
{
  "park_name": "Parco Ciani",
  "review_count": 292,
  "unique_word_count": 156,
  "category_weights": {
    "experiential_emotional": 0.461,
    "action": 0.204,
    "sensory_environmental": 0.180,
    "infrastructure_amenities": 0.097,
    "relational_context": 0.048,
    "tension_complaint": 0.010
  },
  "words": [
    {
      "word": "beautiful",
      "category": "experiential_emotional",
      "frequency": 292,
      "context_excerpt": "Un posto bellissimo con una vista mozzafiato sul lago.",
      "co_occurring": ["peaceful", "relaxing", "magical"]
    },
    // ... more words
  ]
}
```

**Category color map:**
```json
{
  "experiential_emotional": "#C4A8FF",
  "sensory_environmental": "#40FFB8",
  "action": "#52E8FF",
  "relational_context": "#FFE040",
  "tension_complaint": "#FF7060",
  "infrastructure_amenities": "#FFB47A"
}
```

---

## TECHNICAL IMPLEMENTATION NOTES

**For the full-screen aura immersion (Screen 1, Phase 3):**
- Use HTML Canvas or WebGL for the gradient rendering — SVG will struggle with the smooth color blending at this scale
- The aura should be a single large radial gradient mesh composition, not 6 separate circles
- Layer 5–6 radial gradients at offset positions within a 1800px clipping circle, same technique as map view
- Position the circle at viewport center with overflow hidden on the container

**For the word network layout (Screen 2):**
- Use a force-directed graph library: D3.js force simulation, or Sigma.js, or Cytoscape.js
- Apply zone boundary constraints by adding a "wall" force that repels words from crossing their category boundary
- Pre-calculate the layout server-side if possible — running force simulation in real-time can be slow for 100+ words

**For connection line animation:**
- Use SVG `<path>` elements with stroke-dasharray + stroke-dashoffset animation for the "draw from center" effect
- Or use Canvas with requestAnimationFrame for smoother performance

**For mobile/touch:**
- Use larger tap targets (minimum 44×44px invisible hit area around each word)
- Implement the "tap to lock hover state" behavior to make tooltip readable
- Consider reducing max word count on mobile to ~60 words if performance is an issue

**For the "add a word" input:**
- Simple form POST to a Google Sheet, Airtable, or a lightweight backend endpoint
- No authentication required — it's intentionally frictionless
- Rate limit by IP to prevent spam (max 5 submissions per hour)

---

## ANIMATION TIMING SUMMARY

| Transition | Duration | Easing |
|---|---|---|
| Map zoom to park | 1000ms | ease-out |
| Park context fade-in | 500ms | ease |
| Aura expansion to full-screen | 1000ms | ease-in-out |
| Aura pulse (looping) | 4000ms | ease-in-out sinusoidal |
| Category blobs emerging | 500ms | ease-out |
| Words materializing | 500ms | ease-out, staggered |
| Word hover scale | 150ms | ease-out |
| Tooltip fade-in | 150ms | ease |
| Connection line draw | 200ms | ease-out |

All animations should use CSS `will-change` property or Canvas optimization to maintain 60fps.

---

## ACCESSIBILITY NOTES

- All interactive words must have sufficient contrast against background (WCAG AA minimum)
- Tooltip text must be readable at 13px size
- Search field must have visible focus state
- Category legend items must be keyboard-navigable (tab through, enter to activate filter)
- Connection lines should not be the only indicator of relationship — tooltip text also lists connected words
- Provide a "skip to park selection" link for screen reader users who don't want to experience the full transition

---

This prompt is ready for Figma Make. The key elements are: (1) full-screen aura immersion with circular blobs, (2) word network with force-directed layout and category zones, (3) hover interaction revealing connections and context, (4) comparison view for all parks, (5) community input for group discussion.