import { Percent, Landmark, ScrollText, Sunset, Gem, SquareParking, type LucideIcon } from 'lucide-react';

// Locale-agnostic icons for the six selling-point cards, in the same order as
// the `selling[]` array in messages/*.json:
//   1. 5% VAT Eligible      2. Rural Grant         3. Separate Title Deeds
//   4. Sunset Sea Views     5. Stone & Light       6. Private Parking
// Swapping the icon set (or a single icon) is a one-line change here.
export const SELLING_ICONS: LucideIcon[] = [Percent, Landmark, ScrollText, Sunset, Gem, SquareParking];
