export type Side = "groom" | "bride";
export type Relation = "친구" | "친척" | "직장" | "기타";
export type VenueOwner = "groom" | "bride" | "half";

export interface Guest {
  id: string;
  name: string;
  amount: number;
  relation: Relation;
  side: Side;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  side: Side;
}

export interface Settings {
  mealPrice: number;
  minGuests: number;
  venueCost: number;
  venueOwner: VenueOwner;
}

export const DEFAULT_SETTINGS: Settings = {
  mealPrice: 65000,
  minGuests: 200,
  venueCost: 0,
  venueOwner: "half",
};
