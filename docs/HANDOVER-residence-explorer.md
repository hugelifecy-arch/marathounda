# HANDOVER — Terra Something website & Residence Explorer
**Updated 2026-06-27. Read this first when resuming. The session was compacted; this is the source of truth.**

> **PRIME DIRECTIVE (user):** The deliverables must reach the quality level of the **INEX Morea** reference (https://inex-group.com/projects/morea — the user provided screenshots of its interactive masterplan + unit cards). **We loop until we reach that level.** Do not stop/checkpoint after small chunks — keep pushing until a deliverable is genuinely at INEX standard, then show it. The user's repeated feedback has been *"you stopped again"* — bias hard toward completing whole deliverables.

---

## 0. TL;DR — where we are
- **Live site (production):** https://marathounda.vercel.app/en — Next.js 14 site for **Terra Something**, 12 maisonettes, Marathounda, Paphos. Repo: https://github.com/hugelifecy-arch/marathounda (`main` auto-deploys to Vercel).
- **Shipped & live:** (a) a full UX/UI overhaul (AA contrast, 44px touch, Phosphor icons, accessible nav/forms, etc.), (b) **Residence Explorer Phase 1** — an interactive site plan + tabbed unit panel (Overview / Floor Plans & Drawings / Specification / How to Reserve).
- **In progress on branch `claude/residence-explorer`** (worktree: `C:\Users\geras\.config\superpowers\worktrees\marathounda\residence-explorer`): restyling the masterplan + (next) processing the real floor plans. **The current floor-plan PNGs and my SVG masterplan are NOT yet at INEX level — that is the remaining work.**
- **Two mistakes to correct:** (1) I was using the **wrong floor-plan files** (partial `public/floorplans/typeA/B-*.png` crops) — use the real architect drawings instead (see §5). (2) I kept stopping — don't.

---

## 1. The project
- **Brand:** "Terra Something" is the **final** name (confirmed — do not treat as placeholder). 12 maisonettes: Type A = 3-bed end (units 1 & 12), Type B = 2-bed (units 2–11). Developer Rigilia Enterprises Ltd; project finance GN Kalaitsidis Capital; architect **Demis Demetriades Architects**. Datum +304.5m, plots 1064–1067, Marathounda, Paphos.
- **Stack:** Next.js 14 App Router · Tailwind · next-intl (6 locales: en, ru, el, he[RTL], zh, de) · TypeScript · Vercel · Phosphor icons (`@phosphor-icons/react`).
- **Local repo clone:** `C:\Users\geras\OneDrive\Desktop\Consulting\2025.04 Marathounda - K Capital\marathounda` (this is the OneDrive checkout, on `main`).
- **Key product rules:** prices never shown (all "Price on application"); pre-sale opens **September 2026** (sales NOT open today); availability/status edited in `src/data/units.ts` (units 4 & 10 reserved, rest available).

## 2. Production state & git
- `main` HEAD = merge `97fc627` (Residence Explorer P1). Earlier: `00db3b6` (UX overhaul), `aa3e6fa` (timeline).
- **Deploy flow:** merge a feature branch into `main` in the OneDrive checkout (`git merge --no-ff <branch>`) → `git push origin main` → Vercel builds production (~45–75s). Confirm via `gh api repos/hugelifecy-arch/marathounda/commits/<sha>/status`. Public production URL = **marathounda.vercel.app** (custom domain terrasomething.com NOT connected). Preview deploys (feature branches) are behind Vercel SSO — the user can't easily view them, so we deploy to `main` for previews.
- **GH token lacks PR scope** (`gh pr create` fails) — user opens PRs manually if needed; merging via git is fine.
- Branch `claude/residence-explorer` is currently MERGED for P1 but still has uncommitted/committed in-progress masterplan restyle work (see §6). `claude/uxui-fixes` was merged and can be deleted.

## 3. ⭐ THE QUALITY BAR — INEX Morea (loop until we match this)
Reference studied hands-on (https://inex-group.com/projects/morea):
- **"3D masterplan"** = a **pre-rendered aerial turntable**: several aerial renders at different angles cycled with a `360° ← →` control, with **clickable villa hotspots**; click → a card (floor-plan thumb, status pill, m²/beds/baths, "Learn more"). Fullscreen adds Filters, an "All/Master Villas" toggle, "Call me".
- **"2D masterplan"** = a **beautifully styled top-down site plan** (clean villa blocks, numbers, soft landscaping greens, road, pool blue, amenity callouts: Entrance/Clubhouse/Pool/Playground/Exit). Same card.
- **Unit page** = gallery (renders **+ clean styled floor plans**) · key-spec panel · CTAs ("Sign up for a tour" + a gated **"Presentation"** brochure PDF) · a **Specification ("Features") grid** (plot/covered/internal areas, parking, benefits) · narrative.
- **The "feel":** premium, atmospheric, smooth. Their floor plans are **clean presentation plans** (poché walls, furniture, room labels, soft fills, NO dimensions/Greek/title-blocks). Their masterplan looks **designed**, not like raw CAD.

**Acceptance criteria for "INEX level" (what to loop toward):**
1. **Masterplan** that looks designed & atmospheric (real geometry, landscaping, orientation, amenities) — ideally an **aerial render with hotspots**, or a professionally-styled site plan. My current flat-SVG schematic is NOT there yet.
2. **Floor plans** = clean, branded presentation plans (no dimensions/Greek), per the real multi-level layout. Current PNGs are wrong/raw — must be replaced.
3. **Unit experience** = smooth, premium tabbed panel (already decent — keep raising polish).
4. **Real content** in Specification + How to Reserve (no `[TBC]`).

## 4. Deliverables (Residence Explorer) — status
| Deliverable | State | To reach INEX level |
|---|---|---|
| Interactive site plan (replaces grid) | ✅ built, live (`SitePlan.tsx`), accessible | restyle to a designed/atmospheric masterplan (see §6) or swap an aerial render |
| Tabbed unit panel (Overview/Plans/Spec/Reserve) | ✅ built, live (`Residences.tsx`) | keep; raise polish; wire calc deeper |
| Floor Plans & Drawings tab | ⚠️ uses WRONG raw PNG crops | process the **real** drawings (see §5) into clean presentation plans |
| Specification content | ⚠️ scaffolded English `[TBC]` (`src/data/residenceContent.ts`) | replace `[TBC]` with real material/finish schedule, then translate ×6 |
| How to Reserve content | ⚠️ scaffolded English (5-step journey) | confirm exact legal terms, then translate ×6 |
| Aerial 360° turntable (INEX "3D") | ❌ not started | needs **commissioned aerial renders** (none exist — see §5) |

## 5. ⚠️ SOURCE ASSETS — CORRECTED (this is the "wrong files" fix)
**Architect files live under** `C:\Users\geras\OneDrive\Desktop\Consulting\2025.04 Marathounda - K Capital\NEW\`. Use these, NOT the existing `public/floorplans/typeA/B-*.png` (partial crops — WRONG).

- **Floor plans / sections / elevations (authoritative):** `NEW\2026.06.23 Final PPD\` — individual **DWG** files per drawing **and** the combined vector PDF `Marathounta - 12 Maisonettes -ΕΠΒ.pdf` (9 A1 sheets, ArchiCAD/GSPublisher, Greek). The DWG set reveals the building is **MULTI-LEVEL** (split-level maisonettes): `1_-2.-1 LEVEL (LIVING AREA)`, `2_-1.0 LEVEL (BEDROOMS)`, `3_0.MEZZANINE`, `4_1.FIRST FLOOR`, plus elevations (`7_…ΟΨΗ`) and sections (`8_/9_…ΤΟΜΗ`), fencing (`ΠΕΡΙΦΡΑΞΕΙΣ`). **My earlier "ground + first" assumption was oversimplified — the real plans are Living Area / Bedrooms / Mezzanine / First Floor.** Reflect the true levels.
- **Photorealistic renders:** `NEW\2026.06.22 Planning Permit Drawings + 3D\Μαραθούντα - Φωτορεαλιστικά.pdf` (12 sheets) — all **eye-level/street views, NO aerial/bird's-eye**. So an INEX aerial turntable needs **newly commissioned aerial renders**. The 12 renders in `public/renders/` correspond to these.
- **Plot/topo:** `NEW\2026.05.25 Topo boundaries\MARATHOUNTA PLOT1064-1067.dwg`, `NEW\2025.11.03 Topo to Demis\Marathounda-Demis.dwg`. Approved arch PDFs: `NEW\2025.10.31 Docs to Demis\ΕΓΚΡΙΜΕΝΑ ΑΡΧΙΤΕΚΤΟΝΙΚΑ ΣΧΕΔΙΑ.pdf`; permit PDF `NEW\2026.06.22 Planning Permit Drawings + 3D\Marathounta - ΠΟΛΕΟΔΟΜΙΚΗ ΑΔΕΙΑ.pdf`.

**Real geometry (read off the ΕΠΒ site plan, sheet 1):** the 12 maisonettes are a **single terraced building that steps/dog-legs along the angled western edge of a wedge-shaped plot**; the rest of the plot is gardens/landscape, with village access to the SE and sunset/sea views to the W. (The data's `level: lower(1–7)/upper(8–12)` ≈ front/back terrace levels.)

**Processing reality:** DWG can't be read directly here (no CAD tooling). The **ΕΠΒ PDF is vector** and renderable via **PyMuPDF (`fitz`)** (poppler/`pdftoppm` is NOT installed — Read-tool PDF fails; use fitz). Auto-cleaning vector→clean-plan is hard (flat vector, no layers). **Best routes to INEX-clean plans:** (A) ask architect Demis Demetriades to **re-export clean presentation layouts** from ArchiCAD (fastest, best); (B) convert DWG→SVG/PDF and restyle in design tooling; (C) carefully process/redraw from the vector. User chose **"I style everything"** — so attempt (C)/(B), but flag if quality can't reach the bar without (A).

## 6. What's committed on `claude/residence-explorer`
- `dd8145b` — `SitePlan.tsx` (interactive SVG site plan) + wired into `Residences.tsx` replacing the grid; `sitePlanNote` key ×6.
- `2e75eea` — tabbed unit panel + `src/data/residenceContent.ts` (Spec + Reserve scaffold) + 7 i18n keys ×6.
- **Uncommitted (in worktree):** a restyled `SitePlan.tsx` (added wedge plot outline, garden fills, tree dots, access road, sunset/sea gradient, north arrow, building footprint, two terrace bands). **It builds clean but was not yet visually verified or committed when the session was compacted** — verify it renders, judge against the INEX bar, likely iterate further (it's an improvement but probably still below INEX "designed" standard).

## 7. Technical playbook & gotchas
- **i18n edits:** edit all 6 `messages/*.json` together via a small Node script (`JSON.parse` → set keys → `JSON.stringify(obj,null,2)+'\n'`, utf-8). Files store raw non-ASCII, 2-space indent. Top-level keys must match across locales (currently parity holds).
- **Images in dev:** `sharp` is NOT installed → dev `/_next/image` can't make WebP/AVIF → **blank images in the browser in dev only** (prod/Vercel fine). To screenshot locally, temporarily set `images: { unoptimized: true }` in `next.config.mjs`, restart dev, then revert. Don't commit that.
- **GOTCHA — never run `npm run build` while a dev server is live in the same worktree:** it clobbers `.next` and corrupts the running dev server's CSS (page renders unstyled). After any build, `rm -rf .next` and restart dev.
- **Dev scroll quirk:** in the headless/Chrome preview, JS `scrollTo`/`scrollIntoView` often doesn't take (smooth-scroll/overflow). Use physical wheel scroll. Full-page screenshots can hang on the Google Maps iframe / hero slideshow (continuous network) — zoom captures or section captures work.
- **PDF rendering:** `python` (3.12) has `fitz` (PyMuPDF), `pypdfium2`, `pdfplumber`, `pypdf`, `PIL`. Render: `fitz.open(p)[i].get_pixmap(matrix=fitz.Matrix(dpi/72,dpi/72), clip=Rect).save(...)`. Greek text → write summaries as utf-8 (console is cp1252). Scratchpad with rendered crops: `C:\Users\geras\AppData\Local\Temp\claude\…\scratchpad\` (site_plan_crop.png, building_crop.png, renders_pdf/, renders_contact.png) — regenerate if missing.
- **MCP note:** Chrome / computer-use / Claude_Preview MCP tools may disconnect across sessions. Re-acquire via the browser MCP if needed for visual verification; otherwise verify by rendering to images + reading them, and rely on `npm run build` for correctness.
- **Spec doc:** the full residence-explorer spec is in scratchpad `residence-explorer-spec.md` (INEX analysis, options, decisions, drawing-processing workstream).

## 8. User decisions already made
- Visualization: **2D site plan now, architect data-layer so a commissioned aerial 360° turntable can drop in later.** Rename "contract terms" → **"How to Reserve"**. Phase-1 scope = **full tabbed panel**. Drawing styling = **"I style everything"** (attempt in-house; escalate to architect re-export if quality demands). Order requested: **(1) masterplan, then (2) floor plans.** Deploy previews via `main`.

## 9. Open inputs still needed from user (don't block on these — scaffold + mark `[TBC]`)
- Real **material/finish schedule** (for Specification) and **reservation/legal terms** (for How to Reserve).
- **Rural Grant**: user said it DOES apply — need scheme name + grant ceiling to cite specifically (else soften/remove that selling card).
- **Trust facts** (deferred Phase 3 from the UX work): Rigilia + GN Kalaitsidis Capital reg numbers, architect **ETEK** reg, prior projects, escrow/contract specifics, whether to show a "N registered" counter.
- Whether to **commission aerial renders** (to enable the true INEX aerial turntable).

## 10. THE LOOP (how to proceed toward the bar)
1. **Masterplan (task 1):** verify the restyled `SitePlan.tsx`; judge vs INEX. Iterate the SVG (or, better, trace the **real plot+terrace geometry** from the ΕΠΒ sheet-1 vector into a clean branded plan with landscaping/road/amenities/orientation). If SVG can't reach the bar, propose: (a) commission an aerial render + hotspots, or (b) architect-styled site plan. Keep iterating until it reads as "designed", then deploy to `main` and show.
2. **Floor plans (task 2):** from the **correct** source (`NEW\2026.06.23 Final PPD\` — ΕΠΒ PDF / DWGs), produce **clean presentation plans** reflecting the real **multi-level** layout (Living Area / Bedrooms / Mezzanine / First Floor), per type (A/B). Replace `public/floorplans/*` + the data `PLANS` model. Iterate to INEX-clean (no dimensions/Greek). Escalate to architect re-export if needed.
3. **Content:** swap `[TBC]` for real spec + terms when provided; translate ×6.
4. Each loop: build clean → verify visually (render to image / browser) → judge vs INEX → iterate → deploy to `main` → show user → repeat until accepted.
