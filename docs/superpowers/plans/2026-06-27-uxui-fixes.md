# Terra Something UX/UI Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the 72 verified UX/UI review findings (3 critical, 24 high, 24 medium, 21 low) on the Terra Something pre-sale site without altering the core visual identity — raising it to WCAG 2.2 AA, premium-brand polish, and conversion readiness.

**Architecture:** Foundation-first. Establish a semantic token/role layer (Phase 1), produce brand assets + conversion copy that need human input (Phases 2–3, gated), then apply the deterministic code fixes (Phase 4), verify (Phase 5), ship (Phase 6). All work in the isolated worktree on `claude/uxui-fixes`; `main` (auto-deploys to Vercel) is never touched until the ship phase.

**Tech Stack:** Next.js 14 (App Router) · Tailwind CSS · next-intl (6 locales: en, ru, el, he[RTL], zh, de) · TypeScript · Vercel.

**Worktree:** `C:\Users\geras\.config\superpowers\worktrees\marathounda\uxui-fixes` (branch `claude/uxui-fixes`, based on `main` @ aa3e6fa).

**Verification model (no test suite exists):** each task verifies via (a) `npm run build` clean, (b) visual check in the running app across affected locales/breakpoints, and (c) where relevant, an a11y check (contrast ratio, keyboard, screen-reader/ARIA, reduced-motion). "Commit" after each task with a descriptive message.

---

## ⚠️ Decision Gates (need your input before the gated phases run)

| Gate | Blocks | What I need from you |
|------|--------|----------------------|
| **G1 — Icon library** | Phase 2, Task 4.10 | Lucide (recommended, MIT, ~1.5px stroke matches the logo) vs Phosphor. |
| **G2 — Logo direction** | Phase 2 (logo) | Keep the current mark (refined) for now, or commission a distinctive mark? (Wordmark text "Terra Something" is already confirmed final.) |
| **G3 — Trust facts** | Phase 3 (most copy) | Real, citable facts: Rigilia/GN Kalaitsidis reg numbers; architect ETEK reg; any prior projects; **does the rural grant actually apply** (scheme name + ceiling) or remove that card; reservation/escrow/contract specifics; whether to show a "N registered" counter. |
| **G4 — Pre-sale status copy** | Task 4.1 (availability) | Confirm public wording for "Pre-Sale opens September 2026" vs the live "10 of 12 available". (You already confirmed pre-sale is NOT open today.) |

Phase 1 and the deterministic parts of Phase 4 (everything except 4.10 emoji-swap and the new copy/trust sections) are **fully unblocked** and can start immediately — this is the "fast-track quick-wins" path.

---

## File Map (what gets created / modified)

**Created**
- `src/components/Logo.tsx` — shared brand lockup (DRY; used by Header + Footer)
- `src/components/Icon.tsx` — single icon entry-point (wraps chosen library)
- `src/components/TrustStrip.tsx` — developer/architect credibility (Phase 3, gated)
- `src/components/BuyerSafeguards.tsx` — off-plan reassurance + CTA bridge (Phase 3, gated)
- `src/hooks/useScrollSpy.ts` — active-section tracking for nav
- `src/data/sellingPoints.ts` — selling-point icon keys (locale-agnostic), decoupled from messages

**Modified (token/foundation)**
- `tailwind.config.ts`, `src/app/globals.css`, `src/app/[locale]/layout.tsx`

**Modified (components)**
- `Header.tsx`, `Hero.tsx`, `SellingPoints.tsx`, `Residences.tsx`, `Gallery.tsx`, `Location.tsx`, `Calculator.tsx`, `EnquiryForm.tsx`, `Footer.tsx`, `WhatsAppButton.tsx`
- `src/app/[locale]/page.tsx` (insert TrustStrip + BuyerSafeguards/CTA)
- `src/app/api/enquire/route.ts` (phone optional)
- `messages/{en,ru,el,he,zh,de}.json` (copy + icon-key migration)

---

# PHASE 1 — Design-system token foundation 🔑 (unblocked)

*Codifies the role decisions so every later fix is consistent. For a site this size we extend the existing Tailwind tokens rather than build a 3-layer system.*

### Task 1.1 — Establish AA-safe colour roles

**Files:** Modify `tailwind.config.ts`, `src/app/globals.css`

- [ ] **Step 1 — Add role tokens** to `tailwind.config.ts` `colors` (keep existing material tokens; add semantic aliases):
  - `accentText: '#9A5E38'` (clayDark — AA on light surfaces, 5.21:1) for accent text/links
  - `bodyMuted: '#5A5F4A'` (olive) — already exists; document it as the body-muted role
  - `onDarkMuted: '#9E9C98'` — fixed value ≈ AA on `darker` for disclaimers
- [ ] **Step 2 — Document the role contract** as a comment block in `tailwind.config.ts`: *clay = large/bold ≥18px (or ≥14px bold) only; olive/accentText for normal-weight text; gold = on-dark only; sage fill needs dark text.*
- [ ] **Step 3 — Fix the input focus ring on clay surfaces** in `globals.css`: the global `:focus-visible` ring is clay; add a rule so focus on clay/`bg-clay` elements uses an ink or paper ring with offset (so the ring is visible on the primary buttons).
- [ ] **Step 4 — Build + commit.** `npm run build` clean → `git commit -m "tokens: add AA-safe colour roles + visible focus ring on clay"`

### Task 1.2 — Type/number/spacing utilities

**Files:** Modify `tailwind.config.ts`, `src/app/globals.css`, `src/app/[locale]/layout.tsx`

- [ ] **Step 1 — Tabular figures:** add a `.tnum { font-variant-numeric: tabular-nums; }` utility in `globals.css` (applied in Phase 4 to calculator + m² values).
- [ ] **Step 2 — Section-intro measure:** add a `.section-intro` class (`max-width: 42rem; margin-inline: auto;`) so all section sub-paragraphs share a readable measure.
- [ ] **Step 3 — Fraunces axes/weight:** in `layout.tsx`, pass explicit `weight`/axes to `Fraunces({...})` for intentional display weight (confirm shipped axes in build).
- [ ] **Step 4 — Radius/elevation convention** comment in `globals.css`: standard radius = `rounded-lg`/`rounded-xl`; one shadow scale for cards/panels/dropdowns.
- [ ] **Step 5 — Build + commit.** `git commit -m "tokens: tabular figures, section-intro measure, Fraunces weight"`

**Resolves (root):** #1 contrast, color-semantic/raw-hex, type-scale, tabular figures, radius/elevation consistency, Fraunces axes.

---

# PHASE 2 — Brand assets: icons + logo  ⚠️ G1, G2

### Task 2.1 — [GATE G1] Choose + install icon library
- [ ] **BLOCKED on G1.** On approval: `npm i lucide-react` (or `@phosphor-icons/react`). Create `src/components/Icon.tsx` exposing named icons at a fixed size/stroke.

### Task 2.2 — Selling-point icon mapping (decouple from messages)
**Files:** Create `src/data/sellingPoints.ts`; Modify `SellingPoints.tsx`, all `messages/*.json`
- [ ] Create `sellingPoints.ts` with stable icon keys: `vat→percent`, `grant→landmark`, `deeds→file-badge`, `views→sunset`, `materials→gem`, `parking→square-parking`.
- [ ] Remove the emoji `icon` field from `selling[]` in all 6 message files (keep title/desc).
- [ ] `SellingPoints.tsx`: render `<Icon name=… size={28} className="text-accentText" />` from the data file instead of `{item.icon}`.
- [ ] Add a lint guard (script) rejecting emoji in `messages/*.json`.
- [ ] Build + commit. *(Executable once G1 chosen.)*

### Task 2.3 — Shared `<Logo>` component (DRY) + [GATE G2] mark
**Files:** Create `src/components/Logo.tsx`; Modify `Header.tsx`, `Footer.tsx`
- [ ] Extract the duplicated mark+wordmark into `<Logo variant="onLight|onDark" />`; drive SVG colours from `currentColor`/tokens (not hardcoded hex). Replace `style={{fontSize:9}}` with `text-[0.6875rem]` (scales with user font-size).
- [ ] **[G2]** Keep refined mark for now OR swap to commissioned mark.
- [ ] Build + commit.

**Resolves:** #5 emoji, icon-system unification, logo duplication/hardcoded-hex/9px-wordmark, RTL arrow glyphs (via Icon).

---

# PHASE 3 — Conversion & copy  ⚠️ G3, G4 (multilingual: 6 locales each)

### Task 3.1 — [GATE G3] Collect trust facts
- [ ] **BLOCKED on G3.** Assemble: reg numbers, ETEK reg, prior projects, rural-grant applicability + ceiling, reservation/escrow terms, optional registration count.

### Task 3.2 — TrustStrip component
**Files:** Create `src/components/TrustStrip.tsx`; Modify `page.tsx` (insert between SellingPoints and Residences), `messages/*.json`
- [ ] Two-column credibility strip (developer | architect) with reg/ETEK + prior project. Copy needs G3.

### Task 3.3 — BuyerSafeguards + CTA bridge
**Files:** Create `src/components/BuyerSafeguards.tsx`; Modify `page.tsx` (between Calculator and EnquiryForm), `messages/*.json`
- [ ] Four safeguards (notarised contract, milestone-tied payments, title deed per unit, independent legal counsel) + a single CTA anchoring to `#enquire`. Copy needs G3.

### Task 3.4 — Copy rewrites
**Files:** Modify `messages/*.json` (+ Hero/EnquiryForm where logic ties in)
- [ ] **[G4]** Availability label → "12 residences · Pre-Sale opens September 2026" until pre-sale opens (also Task 4.1).
- [ ] Rural Grant → named scheme + ceiling, or remove the card (per G3).
- [ ] `enquireSub` → outcome-led ("Ten of twelve residences remain. Register for pricing & priority access…"); move payment mechanics below submit.
- [ ] Success state → next-step/expectation copy.
- [ ] `poweredBy` "Powered by" → "Project Finance".
- [ ] Build + commit per locale batch.

**Resolves:** #3/G4 availability, #6 trust/safeguards/CTA, rural-grant, form subheading, success next-step, poweredBy.

---

# PHASE 4 — Implementation: deterministic fixes (unblocked, except 4.10)

*Apply in severity order. Each task = one commit. Tables list exact file:line → change (these ARE the complete changes).*

### Task 4.1 — Contrast remediation pass  🔴
**Files:** Modify `SellingPoints.tsx`, `Gallery.tsx`, `Location.tsx`, `EnquiryForm.tsx`, `Residences.tsx`, `Calculator.tsx`, `Hero.tsx`, all `messages` (availability)

| Location | Change |
|----------|--------|
| Section eyebrows: `SellingPoints.tsx:11`, `Gallery.tsx:38`, `Location.tsx:12`, `EnquiryForm.tsx:41` | `text-clay` → `text-olive` (3.29→5.87:1) |
| `Residences.tsx:130,137`; `Location.tsx:35` | body-weight `text-clay` → `text-accentText`/`text-olive` |
| `Residences.tsx:13` idle sage text; `EnquiryForm.tsx:47` success | `text-sage` → `text-ink`/`text-olive` |
| `Calculator.tsx:77` calcNote | `text-paper/30 text-xs` → `text-onDarkMuted text-sm` |
| `Calculator.tsx:63,69` | `text-paper/40` → `text-paper/70` |
| `Hero.tsx:47-48` availability bar | `bg-clay/90`→`bg-clay`, text `font-semibold text-sm`; copy per Task 3.4/G4 |

- [ ] Verify each pair ≥4.5:1 (or ≥3:1 large/bold). Build + commit.

### Task 4.2 — Touch-target ≥44px pass  🔴/🟠
**Files:** `Hero.tsx`, `Header.tsx`, `Calculator.tsx`, `Residences.tsx`, `Gallery.tsx`, `EnquiryForm.tsx`, `WhatsAppButton.tsx`

| Location | Change |
|----------|--------|
| `Hero.tsx:43` dots | inner span keeps `h-2`; button gets `min-h-[44px] min-w-[44px] flex items-center justify-center` |
| `Header.tsx:72` nav links | add `py-2.5 flex items-center` |
| `Header.tsx:78,96` triggers | `px-2 py-1` → `px-3 py-2.5` (verify ≥8px gap to hamburger) |
| `Calculator.tsx:63` currency | `px-2 py-1` → `px-3 py-2.5` |
| `Residences.tsx:75,83` filters | `py-1.5` → `py-2.5` |
| `Residences.tsx:188`, `Gallery.tsx:75` close | add `p-3 min-w-[44px] min-h-[44px] flex items-center justify-center` |
| `Gallery.tsx:70,72` prev/next | `py-2` → `py-3` |
| `Residences.tsx:149-157` floor tabs | `py-2` → `py-3` |
| `EnquiryForm.tsx:61,67,77` inputs | `py-2` → `py-3` |
| `EnquiryForm.tsx:89` consent box | `h-5 w-5`; ensure label row ≥44px |

- [ ] Build + visual on 375px + commit.

### Task 4.3 — Active/press states pass  🟠
- [ ] Add `active:` states: Hero CTAs (`Hero.tsx:36,37`), WhatsApp (`WhatsAppButton.tsx:7` `active:scale-95`), Gallery prev/next/close (`active:text-gold`), floor tabs (`active:opacity-75`). Fix iOS first-tap on gallery thumb (`Gallery.tsx:56`). Build + commit.

### Task 4.4 — Hero polish  🟠
**Files:** `Hero.tsx`
- [ ] Strengthen text legibility over bright renders: add a localized scrim behind the centered text block (radial/linear behind the headline) or deepen the mid-gradient.
- [ ] `Hero.tsx:25` crossfade `duration-1000` → `duration-500`.
- [ ] Add `aria-live="polite"` "Image N of 4" region; `aria-roledescription="carousel"`/`"slide"`.
- [ ] Safe-area bottom padding so CTAs can't collide with dots/bar on short phones.
- [ ] Build + a11y check + commit.

### Task 4.5 — Residences hierarchy + non-colour status + scroll offset  🟠
**Files:** `Residences.tsx`
- [ ] Make *available* idle state visually dominant (stronger sage fill + ink text); mute reserved/sold; demote the 3-bed `ring-2` to a small corner marker.
- [ ] Add a non-colour status cue per chip + legend (icon/symbol), `aria-hidden` (aria-label already carries status).
- [ ] Replace `scrollIntoView` in `enquireAbout` (`:39-42`) and panel reveal (`:46`) with hash-nav or `scrollTo(top − 64px)` so headings clear the sticky header.
- [ ] Build + visual + commit.

### Task 4.6 — Enquiry form UX + a11y  🟠
**Files:** `EnquiryForm.tsx`, `src/app/api/enquire/route.ts`, `messages`
- [ ] Required markers (`*` + sr-only "required") on name/email/phone/consent; `aria-required`.
- [ ] Client-side on-blur + on-submit validation; per-field error with `aria-describedby`/`aria-invalid`; reserve the generic banner for network errors; conditionally render `role="alert"` only when populated.
- [ ] Move focus to first invalid field on failure (refs + `.focus()`).
- [ ] Stronger input affordance (white fill in card, 2px focus ring via `focus-visible:ring-2 ring-clay ring-offset-1`; remove `focus:outline-none`); darken labels toward ink.
- [ ] `inputMode`/`autocomplete` (email/tel + name/email/tel) for autofill.
- [ ] Make **phone optional** (drop `required`; relax `route.ts:27`); mark "(optional)".
- [ ] Build + a11y + commit.

### Task 4.7 — Navigation + IA  🟠
**Files:** Create `src/hooks/useScrollSpy.ts`; Modify `Header.tsx`, `WhatsAppButton.tsx`
- [ ] Scroll-spy: IntersectionObserver over the 6 sections; active nav link gets `text-clay`/weight + `aria-current="location"` (desktop + mobile).
- [ ] Mobile menu: apply `useFocusTrap`, add Escape-to-close (separate from the dropdown handler's `:27` early-return), body-scroll-lock, `aria-controls`/panel `id`.
- [ ] Header dropdowns: `role="menu"`→`role="listbox"`, children `role="option"` + `aria-selected`; trigger `aria-haspopup="listbox"`.
- [ ] z-index scale: header < dropdowns < modals (`z-[60]`); hide/lower WhatsApp FAB while a lightbox/menu is open; `right-6`→`end-6`; localized `aria-label` ("Contact us on WhatsApp"); `aria-hidden` on its SVG.
- [ ] Build + keyboard test + commit.

### Task 4.8 — Animation timing  🟠
- [ ] `Gallery.tsx:56` `duration-500`→`duration-200`. (Hero done in 4.4.) Build + commit.

### Task 4.9 — Typography & polish tail  🟡/⚪
**Files:** `Calculator.tsx`, `Residences.tsx`, section components, `Location.tsx`, `Footer.tsx`
- [ ] Apply `.tnum` to calculator figure/sliders/loan (`Calculator.tsx:50,68,74`) + m² rows (`Residences.tsx:133-136`).
- [ ] Apply `.section-intro` to all section sub-paragraphs (`Residences:67`, `Gallery:41`, `Location:15`, `Calculator:37`, `EnquiryForm:44`).
- [ ] Timeline `✓`/number → `aria-hidden` glyph + `sr-only` "Completed/Upcoming" (`Location.tsx:56`).
- [ ] Gallery lightbox counter → `aria-live="polite"` (`Gallery.tsx:71`).
- [ ] Container-width consistency (form `max-w-2xl` vs footer `max-w-7xl`); border-radius/elevation consistency per Phase 1 convention.
- [ ] Skip-link label localized for all 6 locales (`layout.tsx:86`).
- [ ] Build + commit.

### Task 4.10 — [GATE G1] Emoji → icon swap finalization
- [ ] **BLOCKED on G1/Task 2.x.** Replace remaining Unicode glyph icons (timeline `✓`, lightbox `‹›✕`, `↗→`) with the chosen Icon set; verify RTL mirroring. Build + commit.

**Resolves:** all remaining high/medium/low findings across interaction, forms, nav, typography, a11y.

---

# PHASE 5 — Verify (accessibility + quality)

### Task 5.1 — Accessibility pass
- [ ] Dispatch the `a11y-architect` agent over the diff; run the `ui-ux-pro-max` Pre-Delivery Checklist §1–§3. Confirm: AA contrast met, ARIA listbox/live-regions/focus-management correct, reduced-motion intact, RTL correct. Fix any gaps.

### Task 5.2 — Code review + run
- [ ] `react-review` / `code-review` over the diff; address findings.
- [ ] `verify` (run the app): click through all 6 locales + 375px mobile — hero, slideshow dots, residence picker + panel + lightbox, gallery lightbox, calculator, **enquiry form submit (valid + invalid)**, mobile menu, scroll-spy. Confirm no console/hydration errors.
- [ ] `npm run build` clean; `build-fix` only if it breaks.

---

# PHASE 6 — Ship

### Task 6.1 — Review + finish
- [ ] `superpowers-requesting-code-review` → address feedback.
- [ ] `superpowers-verification-before-completion` (evidence: build output + screenshots).
- [ ] `superpowers-finishing-a-development-branch`: push `claude/uxui-fixes`, open PR for your review (Vercel preview deploy), merge to `main` on approval (production deploy). Remove the worktree when merged.

---

## Findings → Task coverage (self-review)

- **Contrast (crit #1 + calcNote + 9px wordmark colour):** 4.1, 1.1, 4.9
- **Touch targets (crit Hero dots + ~9 controls):** 4.2
- **Availability/timeline contradiction (crit):** 3.4 + 4.1 (G4)
- **Emoji icons / icon system / logo:** 2.2, 2.3, 4.10
- **Conversion/trust (dev credibility, social proof, safeguards, CTA bridge, rural grant, form subhead, poweredBy, success):** 3.2, 3.3, 3.4
- **Residences hierarchy + colour-only status + scroll offset:** 4.5
- **Hero text-over-image, fade timing, slide announce, safe-area:** 4.4
- **Forms (required, validation, focus, affordance, focus-ring, autofill, phone, consent size):** 4.6, 4.2
- **Navigation (scroll-spy, mobile-menu a11y, dropdown ARIA, z-index, WhatsApp pos/label):** 4.7
- **Animation timing:** 4.4, 4.8
- **Typography (tabular, measure, Fraunces, scale), a11y polish (sr-only, live regions, skip-link):** 1.2, 4.9
- **ARIA dropdown semantics + live regions:** 4.7, 4.4, 4.9
- **Verification of all of the above:** 5.1, 5.2

All 72 findings map to at least one task. Decision gates G1–G4 flagged inline.
