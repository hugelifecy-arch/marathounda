export type UnitStatus = 'available' | 'reserved' | 'sold';
export type PlanType = 'A' | 'B';

export interface Unit {
  id: number;
  renderKey: string;
  type: string;
  planType: PlanType;
  beds: number;
  gf: number;
  ff: number;
  internal: number;
  veranda: number;
  storage: number;
  total: number;
  status: UnitStatus;
  level: 'lower' | 'upper';
}

// Edit status here to update availability across the site
export const UNITS: Unit[] = [
  { id: 1,  renderKey: '01', type: '3-Bed End Maisonette', planType: 'A', beds: 3, gf: 54.02, ff: 68.82, internal: 122.84, veranda: 6.92,  storage: 1.26, total: 131.02, status: 'available', level: 'lower' },
  { id: 2,  renderKey: '09', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.32, ff: 46.66, internal: 98.98,  veranda: 10.90, storage: 0,    total: 109.88, status: 'available', level: 'lower' },
  { id: 3,  renderKey: '03', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.75, ff: 46.66, internal: 99.41,  veranda: 8.14,  storage: 0,    total: 107.55, status: 'available', level: 'lower' },
  { id: 4,  renderKey: '02', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.58, ff: 46.66, internal: 99.24,  veranda: 7.79,  storage: 0,    total: 107.03, status: 'reserved',  level: 'lower' },
  { id: 5,  renderKey: '06', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.20, ff: 46.66, internal: 98.86,  veranda: 8.00,  storage: 0,    total: 106.86, status: 'available', level: 'lower' },
  { id: 6,  renderKey: '11', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.20, ff: 46.66, internal: 98.86,  veranda: 7.96,  storage: 0,    total: 106.82, status: 'available', level: 'lower' },
  { id: 7,  renderKey: '07', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 52.20, ff: 46.66, internal: 98.86,  veranda: 7.96,  storage: 0,    total: 106.82, status: 'available', level: 'lower' },
  { id: 8,  renderKey: '08', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 53.94, ff: 46.72, internal: 100.66, veranda: 8.09,  storage: 0,    total: 108.75, status: 'available', level: 'upper' },
  { id: 9,  renderKey: '10', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 47.53, ff: 44.46, internal: 91.99,  veranda: 9.40,  storage: 0,    total: 101.39, status: 'available', level: 'upper' },
  { id: 10, renderKey: '05', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 47.59, ff: 42.72, internal: 90.31,  veranda: 5.84,  storage: 0,    total: 96.15,  status: 'reserved',  level: 'upper' },
  { id: 11, renderKey: '04', type: '2-Bed Townhouse',      planType: 'B', beds: 2, gf: 48.23, ff: 43.54, internal: 91.77,  veranda: 5.84,  storage: 0,    total: 97.61,  status: 'available', level: 'upper' },
  { id: 12, renderKey: '12', type: '3-Bed End Maisonette', planType: 'A', beds: 3, gf: 60.72, ff: 64.91, internal: 125.63, veranda: 9.40,  storage: 0,    total: 134.03, status: 'available', level: 'upper' },
];

// Floor-plan images are shared by architectural type. Replace a file in
// /public/floorplans/ (same filename) to update the site with no code change.
export const PLANS: Record<PlanType, { ground: string; first: string }> = {
  A: { ground: '/floorplans/typeA-3bed-ground.png', first: '/floorplans/typeA-3bed-first.png' },
  B: { ground: '/floorplans/typeB-2bed-ground.png', first: '/floorplans/typeB-2bed-first.png' },
};
