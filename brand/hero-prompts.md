# Hero media prompts (you generate → I wire in)

The hero has a ready **media seam** in `components/Hero.tsx`. When you produce the
two assets below, drop them in and flip one flag (`HAS_HERO_MEDIA = true`):

- `public/hero/hero-poster.jpg` — the GPT Image 2 still (this is the LCP; paints instantly)
- `public/hero/hero-loop.mp4` — the animated loop (H.264; lazy-loads over the poster)
- `public/hero/hero-loop.webm` — optional, smaller/modern (AV1/VP9)

The H1, the amber **“Why”**, and the CTA stay drawn in code on top; `prefers-reduced-motion`
shows the poster only. So the still/video is the cinematic backdrop — **the subject sits on
the RIGHT, the left ~40% stays dark** for the headline.

---

## 1) GPT Image 2 — the still (paste this)

Generate at **1536×1024 (landscape 3:2)**, crop-safe for a 16:9 web hero.

```json
{
  "type": "Full-bleed website hero background (NO text)",
  "goal": "Cinematic backdrop for torsen.ai hero. Headline + CTA are overlaid in code on the LEFT, so keep the left ~40% dark and uncluttered; the subject is on the RIGHT.",
  "aspect_ratio": "3:2 landscape (1536x1024), composed crop-safe for 16:9",
  "subject": "a single autonomous industrial robot arm frozen mid-failure / mid-misstep in a dark, high-end factory cell, cinematic close-up on the RIGHT of the frame",
  "signature_element": "one continuous glowing amber (#FFB454) data-trace line reconstructing the arm's motion path through the air, ending in a small precise teal (#16C79A) grounded node — thin, elegant, instrument-like, NOT a neon scribble",
  "composition": {
    "subject_position": "right 55-60% of frame",
    "negative_space": "left ~40% is deep near-empty shadow for an overlaid headline — no important detail there",
    "depth": "shallow depth of field; subject crisp; background soft bokeh"
  },
  "lighting": "deep blacks, low-key; cool teal rim light on the arm's edge; faint warm amber glow only along the trace; volumetric haze",
  "palette": "near-black #0B0E14 base, teal #16C79A, amber #FFB454 — restrained, max 3 accent hues",
  "mood": "premium, technical, restrained, 'ingenious not flashy'; forensic/accountability tone; high-end engineering-tool brand film still",
  "camera": "full-frame cinematic, 35-50mm, slight low angle, subtle film grain",
  "constraints": {
    "must": ["NO text/letters/numbers/logos/watermarks/UI", "keep left ~40% dark and simple", "single uncluttered hero subject", "photoreal / high-end CGI realism"],
    "avoid": ["bright clean startup look", "purple-pink gradients", "neon cyberpunk overload", "busy background", "multiple robots", "flares washing out the left", "any baked-in caption"]
  },
  "quality": "ultra-detailed, 4k, cinematic color grade"
}
```

Save the result as `public/hero/hero-poster.jpg` (also export a high-res copy).

---

## 2) Image → video — the animate prompt (paste into Runway / Kling / Veo / Luma)

Feed the still above as the init image. Settings: **~6s, seamless loop, muted, landscape/16:9**, export MP4 (H.264) + WebM if available.

```
Animate this still into a slow, premium ~6-second ambient LOOP. Hold the composition exactly; do not change layout, do not add text or UI.
Motion: a very subtle slow camera push-in (3-4%) toward the robot arm; volumetric haze drifts gently; the cool teal rim light shimmers faintly; the amber data-trace energizes/“draws” along its path and the teal grounded node pulses softly once. The robot arm stays almost still — at most a tense micro-tremor (it is frozen mid-failure, not operating).
Mood: calm, forensic, cinematic, restrained. No people, no new objects, no camera shake, no text. Seamless loop. Keep the left ~40% dark and empty.
```

Save as `public/hero/hero-loop.mp4` (+ optional `hero-loop.webm`). Then tell me, and I set
`HAS_HERO_MEDIA = true` in `components/Hero.tsx` and re-test (poster LCP + lazy video +
reduced-motion fallback).
