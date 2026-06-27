// Scaffolded Specification + "How to Reserve" content for the unit panel.
// ⚠️ INDICATIVE PLACEHOLDERS — replace `value`s marked [TBC] with the real
// material/finish schedule (from the architect) and the real reservation terms
// (from legal). Strings are English for now; translate into messages/*.json
// once finalised. Areas come from the live UNITS data, not here.

export interface SpecRow { label: string; value: string }
export interface SpecGroup { title: string; rows: SpecRow[] }

// Project-wide specification (applies to all residences). Per-unit areas are
// shown on the Overview tab from UNITS.
export const SPECIFICATION: SpecGroup[] = [
  {
    title: 'Construction & envelope',
    rows: [
      { label: 'Structure', value: 'Reinforced concrete frame' },
      { label: 'External walls', value: 'Natural stone cladding + white render, thermally insulated' },
      { label: 'Roof', value: 'Insulated flat roof with waterproofing' },
      { label: 'Glazing', value: 'Double-glazed thermally-broken aluminium [TBC]' },
    ],
  },
  {
    title: 'Interior finishes',
    rows: [
      { label: 'Flooring', value: 'Porcelain tile / engineered timber [TBC]' },
      { label: 'Kitchen', value: 'Fitted kitchen with appliances [TBC]' },
      { label: 'Bathrooms', value: 'Quality sanitaryware & full-height tiling [TBC]' },
      { label: 'Internal doors', value: '[TBC]' },
    ],
  },
  {
    title: 'Systems & energy',
    rows: [
      { label: 'Climate', value: 'Provision for A/C; [underfloor heating TBC]' },
      { label: 'Hot water', value: 'Solar + electric [TBC]' },
      { label: 'Energy rating', value: 'Energy Performance Class [TBC]' },
      { label: 'Parking', value: 'Private parking per residence + visitor spaces' },
    ],
  },
  {
    title: 'Ownership',
    rows: [
      { label: 'Title', value: 'Separate title deed per residence' },
      { label: 'VAT', value: '5% reduced VAT eligible (primary residence, Cyprus Law 42(I)/2023)' },
      { label: 'Communal', value: 'Shared/communal fees apply · no communal pool' },
    ],
  },
];

export interface ReserveStep { title: string; desc: string }

// The purchase journey ("How to Reserve") — buyer-friendly, drawn from known
// facts. Confirm exact terms/figures with legal before launch [TBC].
export const RESERVE_STEPS: ReserveStep[] = [
  { title: 'Register your interest', desc: 'Tell us the residence you like to receive pricing, floor plans and priority access when pre-sale opens (September 2026). No obligation.' },
  { title: 'Reserve', desc: 'A 30% deposit and a signed reservation agreement secure your chosen residence and fix the price.' },
  { title: 'Sign the contract', desc: 'A notarised purchase contract is prepared. We recommend (and support) appointing an independent Cyprus-registered lawyer.' },
  { title: 'Staged payments', desc: 'Remaining payments are tied to verified construction milestones — not arbitrary dates.' },
  { title: 'Completion & title', desc: 'On handover (~18 months from start) a separate title deed is registered in your name.' },
];
