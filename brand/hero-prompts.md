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
  "subject": "a single advanced humanoid robot frozen at the moment of failure, mid-way through a complex manipulation task (e.g. handling/placing an object that is slipping or being dropped), in a real un-caged industrial or lab environment; cinematic medium close-up on the RIGHT of the frame; a grounded, believable engineering prototype — NOT a glossy consumer sci-fi character",
  "signature_element": "one continuous glowing amber (#FFB454) data-trace line reconstructing the humanoid's motion — the path of its hand/arm and the mishandled object's trajectory through the air — ending in a small precise teal (#16C79A) grounded node — thin, elegant, instrument-like, NOT a neon scribble",
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
    "avoid": ["bright clean startup look", "purple-pink gradients", "neon cyberpunk overload or glossy consumer sci-fi / hype render", "a caged fixed industrial robotic arm", "glamour face close-up of the humanoid", "busy background", "multiple robots", "flares washing out the left", "any baked-in caption"]
  },
  "quality": "ultra-detailed, 4k, cinematic color grade"
}
```

Save the result as `public/hero/hero-poster.jpg` (also export a high-res copy).

---

## 2) Image → video — the animate prompt (paste into Runway / Kling / Veo / Luma)

Feed the still above as the init image. Settings: **~6s, seamless loop, muted, landscape/16:9**, export MP4 (H.264) + WebM if available.

```
Animate this exact still into a slow, premium ~6-second ambient LOOP that "plays" the reconstruction. Use the image as-is; hold the composition and framing; add no text, UI, people, or new objects.
Frozen evidence: the humanoid stays locked in its just-dropped, bent-forward pose and the dark crate stays frozen mid-air (it is evidence, not live physics) — allow only a tense micro-tremor / faint servo vibration in the robot and an almost imperceptible drift of the crate.
The reconstruction: the glowing amber data-trace draws / energizes along its arc from the robot's hand down to the teal grounded node on the floor — a soft pulse of light travels the curve once — and the teal node pulses gently one or two times.
Atmosphere: LOCKED-OFF camera — do NOT push in, zoom, pan or dolly (a moving camera cannot loop and is the #1 thing that breaks the loop). Only in-scene ambience moves: volumetric warehouse haze drifts gently, the cool blue background work-lights and the teal rim light on the chassis shimmer faintly.
Mood: calm, forensic, cinematic, restrained. No camera motion, no camera shake, no large motion, no relighting. Make the motion cyclic and seamless — the last frame should match the first. Muted. Keep the left ~40% dark and empty for the headline.
(Note: the site also boomerangs the clip — plays it forward then reversed — so subtle, ambient, locked-camera motion loops best.)
```

Save as `public/hero/hero-loop.mp4` (+ optional `hero-loop.webm`). Then tell me, and I set
`HAS_HERO_MEDIA = true` in `components/Hero.tsx` and re-test (poster LCP + lazy video +
reduced-motion fallback).
