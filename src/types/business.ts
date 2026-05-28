// ─── Business ─────────────────────────────────────────────────────────────────────

export interface DaySchedule {
  enabled: string;
  open: string;
  close: string;
}

export interface OpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface Business {
  name: string;
  email: string;
  phone: string;
  address: string;
  opening_hours: OpeningHours;
  timezone: string;
}

// ─── Theme ─────────────────────────────────────────────────────────────────────

export interface Theme {
  primary_color: string;
  logo: string | null;
}

// ─── Social ───────────────────────────────────────────────────────────────────

export interface Social {
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  linkedin: string | null;
}

// ─── Settings ───────────────────────────────────────────────────────────────────

export interface Settings {
  business: Business;
  theme: Theme;
  social: Social;
}
