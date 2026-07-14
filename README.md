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

## Deploy (GitHub Pages, custom domain www.torsen.ai)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the export and publishes it.
Every push to `main` redeploys automatically. The site is live at **https://www.torsen.ai**.

**`www` is canonical, and the apex redirects to it — not the other way round.**
`public/CNAME` contains `www.torsen.ai`; that file is the source of truth and it is what
GitHub reads on every deploy. The apex `torsen.ai` keeps A records pointing at GitHub Pages
purely so that GitHub can serve the `torsen.ai → www.torsen.ai` redirect. Do not "fix" this
by pointing the custom domain at the apex; you would only be reintroducing the split below.

### DNS (GoDaddy)

| Type  | Name  | Value                    | Why |
|-------|-------|--------------------------|-----|
| A     | `@`   | `185.199.108.153`        | apex → Pages, so Pages can redirect it to `www` |
| A     | `@`   | `185.199.109.153`        | |
| A     | `@`   | `185.199.110.153`        | |
| A     | `@`   | `185.199.111.153`        | |
| CNAME | `www` | `cytabtorsen.github.io.` | the canonical host |

`@` must hold **exactly** those four A records and nothing else. Microsoft 365 records
(MX, SPF/DMARC TXT, autodiscover/sip/msoid/lyncdiscover CNAMEs, SRV) are unrelated — leave
them alone.

### ⚠️ The GoDaddy Websites + Marketing trap

Until 2026-07, the apex also carried two A records at `76.223.105.230` and `13.248.243.5` —
AWS Global Accelerator IPs belonging to **GoDaddy's Websites + Marketing** site builder,
which was still publishing the old pre-pivot page. DNS round-robins across every A record,
so roughly a **third of everyone typing `torsen.ai` was served a dead site**, silently, for
months. `www` was always fine, which is exactly why it went unnoticed.

If those records ever reappear: **deleting them is not enough.** While the builder site is
still published on the domain, GoDaddy re-adds them. Disconnect or delete the Websites +
Marketing site itself, then clear the records.

### If the apex ever shows a TLS warning

GitHub issues the certificate from whatever the DNS said at validation time. If the zone was
dirty then, you get a cert covering `www.torsen.ai` only, and `https://torsen.ai` presents
GitHub's default `*.github.io` cert — a browser security interstitial, which is a worse look
than a wrong page. Fix by forcing re-validation against the now-clean zone:

```sh
gh api repos/cytabtorsen/Torsen-webiste/pages --jq '.https_certificate.domains'  # must list BOTH
gh api -X PUT repos/cytabtorsen/Torsen-webiste/pages --input - <<< '{"https_enforced": false}'
gh api -X PUT repos/cytabtorsen/Torsen-webiste/pages --input - <<< '{"cname": null}'
gh api -X PUT repos/cytabtorsen/Torsen-webiste/pages --input - <<< '{"cname": "www.torsen.ai"}'
```

Cert issuance is asynchronous — allow up to ~1h, then confirm **Enforce HTTPS** is back on.
