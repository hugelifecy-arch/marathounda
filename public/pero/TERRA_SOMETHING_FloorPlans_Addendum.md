# TERRA SOMETHING — Floor Plans Addendum (for Claude Code)

**This extends the main playbook.** It covers how to display floor plans when a user clicks a residence.

---

## KEY PRINCIPLE: Plans by TYPE, not 12 separate plans

The 12 residences are only **two architectural types**. Showing "Type A / Type B" plans is standard developer practice and far cleaner than 12 near-identical images.

| Type | Description | Units | Plan files |
|------|-------------|-------|------------|
| **Type A** | 3-Bed End Maisonette | **1, 12** | `typeA-3bed-ground.png` + `typeA-3bed-first.png` |
| **Type B** | 2-Bed Mid Townhouse | **2, 3, 4, 5, 6, 7, 8, 9, 10, 11** | `typeB-2bed-ground.png` + `typeB-2bed-first.png` |

> Units 9–11 are marginally smaller than 2–8 but share the identical Type B layout. The per-unit **areas** (already in `data/units.ts`) capture the exact m² differences; the **plan image** is shared by type.

---

## FILES PROVIDED

Place these in `/public/floorplans/`:

```
/public/floorplans/
  ground-floor-full.png      ← full building, ground floor (all units)
  first-floor-full.png       ← full building, first floor (all units)
  typeA-3bed-ground.png      ← 3-bed end, ground floor
  typeA-3bed-first.png       ← 3-bed end, first floor
  typeB-2bed-ground.png      ← 2-bed mid, ground floor
  typeB-2bed-first.png       ← 2-bed mid, first floor
```

---

## DATA MODEL — add `planType` to each unit

In `data/units.ts`, add a `planType` field:

```ts
// planType: "A" for units 1 & 12, "B" for all others
{ id: 1,  planType: "A", ... },
{ id: 2,  planType: "B", ... },
// ... 3–11 all "B"
{ id: 12, planType: "A", ... },
```

Plan-image lookup:

```ts
const PLANS = {
  A: { ground: "/floorplans/typeA-3bed-ground.png", first: "/floorplans/typeA-3bed-first.png" },
  B: { ground: "/floorplans/typeB-2bed-ground.png", first: "/floorplans/typeB-2bed-first.png" },
};
```

---

## UNIT DETAIL PANEL — behaviour

When a user clicks a residence on the site plan, the detail panel shows:

1. The unit's **exterior render** (already wired: `/renders/render-XX.jpg`)
2. The **area schedule** (already wired from `units.ts`)
3. **NEW: a "Floor Plans" block** with two tabs — **Ground Floor** and **First Floor** — showing `PLANS[unit.planType].ground` and `.first`
4. Each plan image is clickable → opens in the same **lightbox** component used by the gallery (zoom for detail)

Suggested layout: render on top, area schedule beside it, floor-plan tabs full-width beneath, then the "Enquire" button.

```tsx
// Floor plan tabs (pseudo-structure)
<div className="floorplan-block">
  <div className="tabs">
    <button onClick={() => setFloor("ground")}>{t.groundFloor}</button>
    <button onClick={() => setFloor("first")}>{t.firstFloor}</button>
  </div>
  <button onClick={() => openLightbox(PLANS[unit.planType][floor])}>
    <Image src={PLANS[unit.planType][floor]} alt={`${unit.type} — ${floor} floor plan`}
           width={1200} height={500} className="plan-img" />
  </button>
  <p className="plan-caption">{t.planCaption}</p>  {/* "Indicative layout. Areas per residence above." */}
</div>
```

---

## TRANSLATION KEYS TO ADD (all 6 locales)

Add to each `messages/{locale}.json`:

```
groundFloor   — EN "Ground Floor" · RU "Первый этаж" · EL "Ισόγειο" · HE "קומת קרקע" · ZH "一层" · DE "Erdgeschoss"
firstFloor    — EN "First Floor"  · RU "Второй этаж" · EL "Όροφος"  · HE "קומה ראשונה" · ZH "二层" · DE "Obergeschoss"
floorPlans    — EN "Floor Plans"  · RU "Планировки" · EL "Κατόψεις" · HE "תוכניות" · ZH "户型图" · DE "Grundrisse"
planCaption   — EN "Indicative layout. Exact areas per residence shown above." (translate per locale)
```

---

## OPTIONAL: full-building plans on the Project page

`ground-floor-full.png` and `first-floor-full.png` show the entire terrace. Optionally add a small "Site Layout" subsection on the Project page with these two, so buyers can see how all 12 units sit together. Same lightbox on click.

---

## IMPORTANT — quality note for the developer

The supplied plans are extracted from the **architectural permit set**. All sensitive permit metadata (owner names, ETEK number, planning coefficients, plot numbers, signatures) has been **removed** — only the layout geometry remains. They still carry technical artefacts (dimension lines, site contour hatching).

**Recommendation:** For the final production site, request **clean marketing floor plans** from Demis Demetriades Architects — simplified, furnished, no dimensions or contours, ideally one per type with room labels in EN. These drop straight into `/public/floorplans/` replacing the current files (keep the same filenames and nothing else changes). Until then, the extracted plans are a working placeholder.

---

## ACCEPTANCE (floor plans)

- [ ] Clicking any residence shows Ground/First floor tabs
- [ ] Units 1 & 12 show Type A (3-bed) plans; all others show Type B (2-bed)
- [ ] Plan images open in the lightbox on click
- [ ] Captions translated in all 6 locales
- [ ] Replacing a file in `/public/floorplans/` updates the site with no code change
