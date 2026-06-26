# TERRA SOMETHING — Claude Code Build & Deployment Playbook

**Paste this entire document into Claude Code as your first message.** The repo already contains the 12 render images and the prototype JSX. Your job is to turn the prototype into a production Next.js 14 website, wire in the real renders, and deploy it to Vercel at `terrasomething.com`.

---

## 0. CONTEXT — READ FIRST

You are building the official pre-sale website for **Terra Something**, a residential development of **12 maisonettes** in **Marathounda village, Paphos, Cyprus**.

- **Developer:** Rigilia Enterprises Ltd
- **Powered by:** GN Kalaitsidis Capital Ltd
- **Architect:** Demis Demetriades Architects LLC
- **Status:** Pre-sale opens September 2026. Construction begins after 60% reservations. Completion ~18 months from start.
- **Pricing:** On request (do NOT display prices anywhere)
- **Domain:** terrasomething.com

In the repo you will find:
- `/renders/render-01.jpg` … `/renders/render-12.jpg` — the 12 photorealistic exterior renders (full resolution, up to 1920×1080)
- `terra-something-website.jsx` — the approved **design prototype**. Use it as the visual and structural reference: colours, typography, layout, sections, components, copy, and all 6 language translations are already in it. **Extract the translation objects and unit data directly from this file** — do not rewrite them.

**Important:** The prototype embeds the renders as base64 for preview only. In production, reference the real files from `/public/renders/` instead.

---

## 1. TECH STACK

- **Next.js 14** (App Router)
- **next-intl** for internationalization (6 locales)
- **TypeScript**
- **Tailwind CSS** (match the prototype's palette exactly — see §4)
- **Vercel** for hosting
- Fonts: **Fraunces** (display serif) + **Outfit** (body sans) via `next/font/google`

---

## 2. LANGUAGES (6 locales)

Routing pattern: `/[locale]/...` with locale-prefixed URLs.

| Locale | Code | Direction |
|--------|------|-----------|
| English | `en` | LTR (default) |
| Russian | `ru` | LTR |
| Greek | `el` | LTR |
| Hebrew | `he` | **RTL** |
| Chinese | `zh` | LTR |
| German | `de` | LTR |

- Pull all translation strings from the `T` object in the prototype JSX (keys: nav, heroTag, heroTitle, heroSub, selling[], resTitle, calc*, distances[], timeline[], enquire*, footer, etc.).
- Hebrew must render full RTL layout (`dir="rtl"`), mirroring the prototype's `isRTL` handling.
- Add `hreflang` alternates for all 6 locales in `<head>`.
- Auto-detect browser language on first visit and redirect to the matching locale; default to `en`.

---

## 3. SITE STRUCTURE (sections, in order)

Replicate the prototype exactly:

1. **Header** — sticky, logo left, nav + currency selector + language dropdown right
2. **Hero** — full-bleed slideshow cycling renders 01, 12, 04, 09 (4.5s interval, dark gradient overlay, manual dots), title, subtitle, two CTAs, availability bar below
3. **Project** (01) — intro headline + 6 selling-point cards (5% VAT, Rural Grant, Separate Title Deeds, Sunset Sea Views, Stone & Light, Private Parking)
4. **Residences** (02) — interactive site plan of 12 units (green=available, clay=reserved, 3-bed end units outlined). Click a unit → detail panel with its render, full area schedule, and "Enquire" button
5. **Gallery** (03) — responsive masonry grid of all 12 renders → click opens full-screen lightbox with ‹ › navigation + counter
6. **Location** (04) — Google Maps embed (coords 34.7925, 32.4828) + distance list + construction timeline tracker
7. **Calculator** (05) — mortgage calculator with Eurobank rate (sliders: price, deposit %, term, rate), live currency conversion
8. **Enquire** (06) — contact form (name, email, phone, residence dropdown, message) + contact details
9. **Footer** — logo, contact numbers, developer info, legal disclaimer
10. **Floating WhatsApp button** → `https://wa.me/35799854773`

---

## 4. DESIGN TOKENS (match prototype exactly)

```
Background:    #F4F1EA  (limestone)
Paper:         #FFFFFF
Ink/text:      #22201C  (charcoal)
Clay/accent:   #B5764D  (terracotta — primary buttons, accents)
Clay dark:     #9A5E38
Olive:         #5A5F4A  (nav text)
Sage:          #7C8868  (available units)
Gold:          #E8B96E  (highlights on dark sections)
Line/border:   #E3DDD0
Dark section:  #22201C / #1A1814 (calculator, footer)
```

Display font: **Fraunces** (weights 400–600). Body font: **Outfit** (300–600).

---

## 5. UNIT DATA (the 12 residences)

Use exactly this schedule (already in the prototype's `UNITS` array). Each unit's `renderKey` maps to `/public/renders/render-XX.jpg`.

| Unit | Type | Beds | GF m² | FF m² | Internal m² | Veranda m² | Storage m² | Total m² | renderKey | Status |
|------|------|------|-------|-------|-------------|------------|------------|----------|-----------|--------|
| 1 | 3-Bed End Maisonette | 3 | 54.02 | 68.82 | 122.84 | 6.92 | 1.26 | 131.02 | 01 | available |
| 2 | 2-Bed Townhouse | 2 | 52.32 | 46.66 | 98.98 | 10.90 | – | 109.88 | 09 | available |
| 3 | 2-Bed Townhouse | 2 | 52.75 | 46.66 | 99.41 | 8.14 | – | 107.55 | 03 | available |
| 4 | 2-Bed Townhouse | 2 | 52.58 | 46.66 | 99.24 | 7.79 | – | 107.03 | 02 | reserved |
| 5 | 2-Bed Townhouse | 2 | 52.20 | 46.66 | 98.86 | 8.00 | – | 106.86 | 06 | available |
| 6 | 2-Bed Townhouse | 2 | 52.20 | 46.66 | 98.86 | 7.96 | – | 106.82 | 11 | available |
| 7 | 2-Bed Townhouse | 2 | 52.20 | 46.66 | 98.86 | 7.96 | – | 106.82 | 07 | available |
| 8 | 2-Bed Townhouse | 2 | 53.94 | 46.72 | 100.66 | 8.09 | – | 108.75 | 08 | available |
| 9 | 2-Bed Townhouse | 2 | 47.53 | 44.46 | 91.99 | 9.40 | – | 101.39 | 10 | available |
| 10 | 2-Bed Townhouse | 2 | 47.59 | 42.72 | 90.31 | 5.84 | – | 96.15 | 05 | reserved |
| 11 | 2-Bed Townhouse | 2 | 48.23 | 43.54 | 91.77 | 5.84 | – | 97.61 | 04 | available |
| 12 | 3-Bed End Maisonette | 3 | 60.72 | 64.91 | 125.63 | 9.40 | – | 134.03 | 12 | available |

> **Make unit status easy to edit** — keep it in a single config file (e.g. `data/units.ts`) so the team can flip "available/reserved/sold" without touching components. Consider an admin-friendly comment block.

---

## 6. KEY FACTS / SELLING POINTS (for copy + SEO)

- **5% reduced VAT** eligible (primary residence, Cyprus Law 42(I)/2023)
- **Rural area government housing grant** may be available to eligible local buyers
- **Separate title deeds** per residence
- **Communal/shared fees** apply
- **No communal pool**
- Reservation: **30% deposit** + signed contract, staged payments thereafter
- Elevation +304.5m, panoramic western sunset/sea views
- Natural stone cladding + white render + timber accents, 2 storeys, private parking per unit + visitor spaces
- **Distances:** Paphos town 5km/8min · Airport 12km/15min · Beach 9km/14min · Minthis Golf 4km/7min · International School of Paphos 6km/10min · Paphos General Hospital 6km/10min

---

## 7. MORTGAGE CALCULATOR

- Default rate: **3.06%** (Eurobank Cyprus, editable via slider 2–6%)
- Sliders: Price (€90k–€300k), Deposit (10–50%), Term (5–30yr), Rate (2–6%)
- Standard amortization formula: `M = P·r·(1+r)^n / ((1+r)^n − 1)`
- Live currency conversion: EUR / USD / GBP / RUB / CNY / ILS (use a static fallback rate table, or fetch live rates from a free FX API and cache daily)
- Link out to Eurobank's official property loan calculator
- Disclaimer: indicative only, not financial advice, 80% LTV max, 0.10–0.25% green discount for energy-efficient homes

---

## 8. CONTACT INFO

- **Phones:** +357 94 000015 · +357 99 854773 · +357 99 478073
- **Email:** info@kalaitsidis.com
- **WhatsApp:** +357 99 854773
- **Enquiry form:** wire to email delivery — use a form backend such as Resend, Formspree, or a Next.js API route + Nodemailer. Send submissions to info@kalaitsidis.com. Include reCAPTCHA v3 + honeypot for spam protection.

---

## 9. SEO REQUIREMENTS

- Per-locale `<title>` and meta descriptions
- Target keywords:
  - EN: "affordable homes Paphos", "new build Marathounda", "townhouses Paphos", "property for sale Paphos 5% VAT"
  - EL: "φθηνά σπίτια Πάφος", "κατοικίες Μαραθούντα", "νέα ακίνητα Πάφος"
  - RU: "купить дом Пафос", "таунхаус Кипр", "доступное жильё Кипр"
  - DE: "Immobilien Paphos kaufen", "Zypern Neubau"
  - HE: "נכס בקפריסין פאפוס"
  - ZH: "塞浦路斯帕福斯房产", "塞浦路斯投资房产"
- `Residence` / `Product` schema.org JSON-LD for each unit; `RealEstateAgent` / `Organization` schema for the developer
- `hreflang` alternates for all 6 locales
- Auto-generated `sitemap.xml` and `robots.txt`
- OpenGraph + Twitter cards using render-01 as the share image
- All render `<img>` with descriptive alt text + `next/image` optimization + lazy loading

---

## 10. IMAGE HANDLING

- Move the 12 renders to `/public/renders/`
- Use `next/image` everywhere for automatic WebP/AVIF + responsive sizing
- Hero: priority-load render-01; lazy-load the rest
- Gallery: lazy-load all
- Keep originals at full res — Next.js will generate optimized variants

---

## 11. PLACEHOLDERS TO COMPLETE

These were marked ◆ in the prototype — handle them now:

1. **Google Maps embed** — embed an interactive map centred on 34.7925, 32.4828 (Marathounda). Use an `<iframe>` Google Maps embed or the Maps JS API.
2. **Floor plans** — leave a clean, styled "available on request" state in each unit panel for now. The team will supply simplified per-unit floor plan images later; structure the code so dropping `/public/floorplans/unit-XX.jpg` auto-displays them.

---

## 12. BUILD STEPS (execute in order)

1. Scaffold Next.js 14 + TypeScript + Tailwind + next-intl
2. Set up the 6-locale routing with middleware + browser detection
3. Port design tokens to `tailwind.config.ts`; load Fraunces + Outfit
4. Create `data/units.ts` (the table in §5) and `messages/{locale}.json` (from the prototype `T` object)
5. Build components: Header, Hero (slideshow), SellingPoints, SitePlan + UnitDetail, Gallery + Lightbox, Location + Timeline, Calculator, EnquiryForm, Footer, WhatsAppButton
6. Move renders to `/public/renders/`; replace base64 with `next/image`
7. Add SEO: metadata, JSON-LD, hreflang, sitemap, robots, OG images
8. Wire the enquiry form to email delivery + spam protection
9. Add Google Maps embed
10. Run `npm run build` — fix all type/lint errors until clean
11. Test all 6 locales, mobile + desktop, lightbox, calculator, form

---

## 13. DEPLOY TO VERCEL

1. Commit and push all changes to the GitHub repo
2. Deploy: either
   - **Vercel dashboard:** vercel.com → Add New Project → import the GitHub repo → it auto-detects Next.js → Deploy, **or**
   - **Vercel CLI / connector:** `vercel --prod`
3. Set environment variables in Vercel (email API key, reCAPTCHA keys, any FX API key)
4. **Connect the domain:** Vercel → Project → Settings → Domains → add `terrasomething.com` and `www.terrasomething.com`. Add the A record (`76.76.21.21`) and the `www` CNAME (`cname.vercel-dns.com`) at the domain registrar. SSL provisions automatically.
5. Verify the live site across all locales and the mobile WhatsApp button.

---

## 14. ACCEPTANCE CHECKLIST

- [ ] All 6 languages switch correctly; Hebrew is full RTL
- [ ] All 12 real renders display in hero, gallery, and unit panels
- [ ] Lightbox opens, navigates, closes
- [ ] Site plan units clickable; correct areas shown; available/reserved colours correct
- [ ] Mortgage calculator math correct; currency conversion live
- [ ] Enquiry form sends to info@kalaitsidis.com; spam protection active
- [ ] No prices displayed anywhere
- [ ] Google Maps embed centred on Marathounda
- [ ] SEO: titles, hreflang, JSON-LD, sitemap, robots all present
- [ ] `npm run build` clean; Lighthouse mobile ≥ 90
- [ ] Live on terrasomething.com with valid SSL

---

**Begin by reading `terra-something-website.jsx` and the `/renders/` folder, then scaffold the project and proceed through §12.**
