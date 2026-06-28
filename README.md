# torsen.ai

The marketing site for **Torsen — the independent black box for physical AI**. It
reconstructs the grounded *“why”* behind an autonomous-robot failure.

Single-page, dark, technical. Next.js (App Router) static export → GitHub Pages.

## Stack

- **Next.js 14** (App Router, TypeScript), `output: 'export'` (static)
- **Tailwind CSS** (design tokens in `tailwind.config.ts`)
- **Framer Motion** (hero parallax + scroll reveals; `prefers-reduced-motion` honored)
- **Geist Sans + Geist Mono** via `next/font` (self-hosted)
- Email capture → **Formspree** (no backend)

Lighthouse (local, mobile): **Performance 98 · Accessibility 100 · Best-Practices 100 · SEO 100**.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> ./out
npm run serve:out  # preview the built ./out on :4321
```

All copy lives in `lib/copy.ts` (single source of truth, guardrail-safe — see the note
in that file: Torsen *witnesses / reconstructs / records*; never *prevents / fixes / controls*).

## Configure the waitlist (Formspree)

1. Create a form at <https://formspree.io> and copy its form id (e.g. `xbjnabcd`).
2. Set it as a build-time env var:
   ```bash
   # .env.local (local) and as a repo/CI variable for deploys
   NEXT_PUBLIC_FORMSPREE_ID=your_form_id
   ```
   Until set, the form validates and shows a graceful “not configured yet” state.

## Hero media (optional upgrade)

The hero ships with a code-native animated visual. To swap in a cinematic still + video,
follow `brand/hero-prompts.md` (GPT Image 2 prompt + image→video prompt), drop the assets in
`public/hero/`, and flip `HAS_HERO_MEDIA = true` in `components/Hero.tsx`.

## Deploy (GitHub Pages, custom domain torsen.ai)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the export and publishes it.

**Cutover (one-time):**
1. Merge this branch to `main` (push triggers the workflow).
2. Repo **Settings → Pages → Source: “GitHub Actions”** (switches off the old branch-root serving).
3. Under Pages, confirm the custom domain reads `torsen.ai` (from `public/CNAME`) and enable **Enforce HTTPS**.
4. Add DNS at GoDaddy (apex `torsen.ai` canonical, `www` redirects):

   | Type  | Name  | Value                   |
   |-------|-------|-------------------------|
   | A     | `@`   | `185.199.108.153`       |
   | A     | `@`   | `185.199.109.153`       |
   | A     | `@`   | `185.199.110.153`       |
   | A     | `@`   | `185.199.111.153`       |
   | AAAA  | `@`   | `2606:50c0:8000::153`   |
   | AAAA  | `@`   | `2606:50c0:8001::153`   |
   | AAAA  | `@`   | `2606:50c0:8002::153`   |
   | AAAA  | `@`   | `2606:50c0:8003::153`   |
   | CNAME | `www` | `cytabtorsen.github.io.`|

   (Remove the old `www`-only record if it conflicts. DNS can take up to ~1h; GitHub then
   provisions the TLS cert.)

Every push to `main` redeploys automatically.
