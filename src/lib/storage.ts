// ============================================
// localStorage-backed persistence layer
// ============================================

// ---------- Types ----------

export interface Flight {
  id: string;
  date: string; // YYYY-MM-DD
  aircraft: string; // tail number
  model: string;
  route: string;
  totalTime: number;
  pic: number;
  sic: number;
  dual: number;
  night: number;
  instrument: number;
  simInstrument: number;
  crossCountry: number;
  landings: number;
  nightLandings: number;
  approaches: number;
  comments: string;
  createdAt: string;
}

export interface Aircraft {
  id: string;
  tailNumber: string;
  model: string;
  year: number;
  category: string;
  notes: string;
  imageColor: string;
}

export interface FlightCost {
  id: string;
  flightId: string; // optional link to a flight
  date: string;
  aircraft: string;
  fuelCost: number;
  rentalCost: number;
  instructorCost: number;
  landingFees: number;
  otherCost: number;
  notes: string;
}

export interface ExternalCost {
  id: string;
  date: string;
  category: ExternalCostCategory;
  amount: number;
  description: string;
}

export type ExternalCostCategory =
  | 'medical'
  | 'insurance'
  | 'training-materials'
  | 'checkride'
  | 'ground-school'
  | 'membership'
  | 'gear'
  | 'misc';

export const EXTERNAL_COST_LABELS: Record<ExternalCostCategory, string> = {
  medical: 'Medical',
  insurance: 'Insurance',
  'training-materials': 'Training Materials',
  checkride: 'Checkride Fees',
  'ground-school': 'Ground School',
  membership: 'Memberships & Dues',
  gear: 'Headset & Gear',
  misc: 'Miscellaneous',
};

// ---------- Keys ----------

const KEYS = {
  flights: 'flightlog_flights',
  aircraft: 'flightlog_aircraft',
  flightCosts: 'flightlog_flight_costs',
  externalCosts: 'flightlog_external_costs',
  seeded: 'flightlog_seeded',
} as const;

// ---------- Helpers ----------

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- Flights ----------

export function getFlights(): Flight[] {
  return read<Flight>(KEYS.flights).sort((a, b) => b.date.localeCompare(a.date));
}

export function addFlight(flight: Omit<Flight, 'id' | 'createdAt'>): Flight {
  const flights = read<Flight>(KEYS.flights);
  const newFlight: Flight = { ...flight, id: uid(), createdAt: new Date().toISOString() };
  flights.push(newFlight);
  write(KEYS.flights, flights);
  return newFlight;
}

export function updateFlight(id: string, updates: Partial<Flight>): void {
  const flights = read<Flight>(KEYS.flights).map((f) =>
    f.id === id ? { ...f, ...updates } : f
  );
  write(KEYS.flights, flights);
}

export function deleteFlight(id: string): void {
  write(KEYS.flights, read<Flight>(KEYS.flights).filter((f) => f.id !== id));
  // Also delete linked costs
  write(
    KEYS.flightCosts,
    read<FlightCost>(KEYS.flightCosts).filter((c) => c.flightId !== id)
  );
}

// ---------- Aircraft ----------

export function getAircraft(): Aircraft[] {
  return read<Aircraft>(KEYS.aircraft).sort((a, b) =>
    a.tailNumber.localeCompare(b.tailNumber)
  );
}

export function addAircraft(aircraft: Omit<Aircraft, 'id'>): Aircraft {
  const list = read<Aircraft>(KEYS.aircraft);
  const newAc: Aircraft = { ...aircraft, id: uid() };
  list.push(newAc);
  write(KEYS.aircraft, list);
  return newAc;
}

export function updateAircraft(id: string, updates: Partial<Aircraft>): void {
  write(
    KEYS.aircraft,
    read<Aircraft>(KEYS.aircraft).map((a) => (a.id === id ? { ...a, ...updates } : a))
  );
}

export function deleteAircraft(id: string): void {
  write(KEYS.aircraft, read<Aircraft>(KEYS.aircraft).filter((a) => a.id !== id));
}

// ---------- Flight Costs ----------

export function getFlightCosts(): FlightCost[] {
  return read<FlightCost>(KEYS.flightCosts).sort((a, b) => b.date.localeCompare(a.date));
}

export function addFlightCost(cost: Omit<FlightCost, 'id'>): FlightCost {
  const list = read<FlightCost>(KEYS.flightCosts);
  const newCost: FlightCost = { ...cost, id: uid() };
  list.push(newCost);
  write(KEYS.flightCosts, list);
  return newCost;
}

export function updateFlightCost(id: string, updates: Partial<FlightCost>): void {
  write(
    KEYS.flightCosts,
    read<FlightCost>(KEYS.flightCosts).map((c) => (c.id === id ? { ...c, ...updates } : c))
  );
}

export function deleteFlightCost(id: string): void {
  write(KEYS.flightCosts, read<FlightCost>(KEYS.flightCosts).filter((c) => c.id !== id));
}

// ---------- External Costs ----------

export function getExternalCosts(): ExternalCost[] {
  return read<ExternalCost>(KEYS.externalCosts).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function addExternalCost(cost: Omit<ExternalCost, 'id'>): ExternalCost {
  const list = read<ExternalCost>(KEYS.externalCosts);
  const newCost: ExternalCost = { ...cost, id: uid() };
  list.push(newCost);
  write(KEYS.externalCosts, list);
  return newCost;
}

export function updateExternalCost(id: string, updates: Partial<ExternalCost>): void {
  write(
    KEYS.externalCosts,
    read<ExternalCost>(KEYS.externalCosts).map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
  );
}

export function deleteExternalCost(id: string): void {
  write(
    KEYS.externalCosts,
    read<ExternalCost>(KEYS.externalCosts).filter((c) => c.id !== id)
  );
}

// ---------- Computed Stats ----------

export interface FlightTotals {
  totalTime: number;
  pic: number;
  sic: number;
  dual: number;
  night: number;
  instrument: number;
  simInstrument: number;
  crossCountry: number;
  landings: number;
  nightLandings: number;
  approaches: number;
  flightCount: number;
}

export function computeTotals(flights?: Flight[]): FlightTotals {
  const list = flights ?? getFlights();
  return list.reduce<FlightTotals>(
    (acc, f) => ({
      totalTime: acc.totalTime + (f.totalTime || 0),
      pic: acc.pic + (f.pic || 0),
      sic: acc.sic + (f.sic || 0),
      dual: acc.dual + (f.dual || 0),
      night: acc.night + (f.night || 0),
      instrument: acc.instrument + (f.instrument || 0),
      simInstrument: acc.simInstrument + (f.simInstrument || 0),
      crossCountry: acc.crossCountry + (f.crossCountry || 0),
      landings: acc.landings + (f.landings || 0),
      nightLandings: acc.nightLandings + (f.nightLandings || 0),
      approaches: acc.approaches + (f.approaches || 0),
      flightCount: acc.flightCount + 1,
    }),
    {
      totalTime: 0, pic: 0, sic: 0, dual: 0, night: 0, instrument: 0,
      simInstrument: 0, crossCountry: 0, landings: 0, nightLandings: 0,
      approaches: 0, flightCount: 0,
    }
  );
}

export interface CurrencyItem {
  name: string;
  status: 'current' | 'warning' | 'expired' | 'unknown';
  detail: string;
}

export function computeCurrency(flights?: Flight[]): CurrencyItem[] {
  const list = flights ?? getFlights();
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const ninetyStr = ninetyDaysAgo.toISOString().split('T')[0];

  const recent = list.filter((f) => f.date >= ninetyStr);
  const recentLandings = recent.reduce((s, f) => s + (f.landings || 0), 0);
  const recentNightLandings = recent.reduce((s, f) => s + (f.nightLandings || 0), 0);
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixStr = sixMonthsAgo.toISOString().split('T')[0];
  const recentApproaches = list
    .filter((f) => f.date >= sixStr)
    .reduce((s, f) => s + (f.approaches || 0), 0);

  return [
    {
      name: 'Day Passenger Currency',
      status: recentLandings >= 3 ? 'current' : recentLandings >= 1 ? 'warning' : 'expired',
      detail: `${recentLandings} of 3 landings in last 90 days`,
    },
    {
      name: 'Night Passenger Currency',
      status: recentNightLandings >= 3 ? 'current' : recentNightLandings >= 1 ? 'warning' : 'expired',
      detail: `${recentNightLandings} of 3 night full-stop landings in 90 days`,
    },
    {
      name: 'Instrument Currency (FAR 61.57)',
      status: recentApproaches >= 6 ? 'current' : recentApproaches >= 3 ? 'warning' : 'expired',
      detail: `${recentApproaches} of 6 approaches in last 6 months`,
    },
  ];
}

export function computeCostSummary() {
  const fc = getFlightCosts();
  const ec = getExternalCosts();
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const yearStart = `${now.getFullYear()}-01-01`;

  const flightTotal = (list: FlightCost[]) =>
    list.reduce((s, c) => s + c.fuelCost + c.rentalCost + c.instructorCost + c.landingFees + c.otherCost, 0);
  const externalTotal = (list: ExternalCost[]) =>
    list.reduce((s, c) => s + c.amount, 0);

  return {
    allTimeFlightCosts: flightTotal(fc),
    allTimeExternalCosts: externalTotal(ec),
    allTimeTotal: flightTotal(fc) + externalTotal(ec),
    monthFlightCosts: flightTotal(fc.filter((c) => c.date >= monthStart)),
    monthExternalCosts: externalTotal(ec.filter((c) => c.date >= monthStart)),
    monthTotal:
      flightTotal(fc.filter((c) => c.date >= monthStart)) +
      externalTotal(ec.filter((c) => c.date >= monthStart)),
    yearFlightCosts: flightTotal(fc.filter((c) => c.date >= yearStart)),
    yearExternalCosts: externalTotal(ec.filter((c) => c.date >= yearStart)),
    yearTotal:
      flightTotal(fc.filter((c) => c.date >= yearStart)) +
      externalTotal(ec.filter((c) => c.date >= yearStart)),
  };
}

// ---------- Export ----------

export function exportFlightsCSV(): string {
  const flights = getFlights();
  if (flights.length === 0) return '';
  const headers = [
    'Date', 'Aircraft', 'Model', 'Route', 'Total Time', 'PIC', 'SIC', 'Dual',
    'Night', 'Instrument', 'Sim Instrument', 'Cross Country', 'Landings',
    'Night Landings', 'Approaches', 'Comments',
  ];
  const rows = flights.map((f) => [
    f.date, f.aircraft, f.model, `"${f.route}"`, f.totalTime, f.pic, f.sic, f.dual,
    f.night, f.instrument, f.simInstrument, f.crossCountry, f.landings,
    f.nightLandings, f.approaches, `"${f.comments}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Seed Data ----------

const SEED_FLIGHTS: Omit<Flight, 'id' | 'createdAt'>[] = [
  { date: '2026-06-28', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KSQL → KPAO', totalTime: 1.2, pic: 1.2, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 0, landings: 3, nightLandings: 0, approaches: 0, comments: 'Pattern work, 3 touch-and-goes' },
  { date: '2026-06-25', aircraft: 'N5251R', model: 'Piper PA-28-181', route: 'KPAO → KWVI → KPAO', totalTime: 2.1, pic: 2.1, sic: 0, dual: 0, night: 0.4, instrument: 0, simInstrument: 0, crossCountry: 2.1, landings: 2, nightLandings: 1, approaches: 0, comments: 'Sunset coastal flight' },
  { date: '2026-06-22', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KSJC → KRHV → KPAO', totalTime: 1.8, pic: 1.8, sic: 0, dual: 0, night: 0, instrument: 0.5, simInstrument: 0, crossCountry: 0, landings: 3, nightLandings: 0, approaches: 2, comments: 'ILS practice with hood' },
  { date: '2026-06-20', aircraft: 'N8520G', model: 'Cessna C182T', route: 'KPAO → KMOD → KPAO', totalTime: 2.5, pic: 2.5, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 2.5, landings: 2, nightLandings: 0, approaches: 0, comments: 'Central valley cross-country' },
  { date: '2026-06-18', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KPAO', totalTime: 1.0, pic: 1.0, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 0, landings: 5, nightLandings: 0, approaches: 0, comments: 'Solo pattern practice' },
];

const SEED_AIRCRAFT: Omit<Aircraft, 'id'>[] = [
  { tailNumber: 'N172SP', model: 'Cessna C172S Skyhawk SP', year: 2005, category: 'Single Engine Land', notes: 'Primary trainer', imageColor: '#0ea5e9' },
  { tailNumber: 'N5251R', model: 'Piper PA-28-181 Archer III', year: 2003, category: 'Single Engine Land', notes: 'Cross-country favorite', imageColor: '#22c55e' },
  { tailNumber: 'N8520G', model: 'Cessna C182T Skylane', year: 2008, category: 'Single Engine Land', notes: 'High performance', imageColor: '#f59e0b' },
];

const SEED_FLIGHT_COSTS: Omit<FlightCost, 'id'>[] = [
  { flightId: '', date: '2026-06-28', aircraft: 'N172SP', fuelCost: 45, rentalCost: 185, instructorCost: 0, landingFees: 0, otherCost: 0, notes: 'Pattern work' },
  { flightId: '', date: '2026-06-25', aircraft: 'N5251R', fuelCost: 78, rentalCost: 315, instructorCost: 0, landingFees: 12, otherCost: 0, notes: 'Coastal flight' },
  { flightId: '', date: '2026-06-22', aircraft: 'N172SP', fuelCost: 55, rentalCost: 270, instructorCost: 65, landingFees: 0, otherCost: 0, notes: 'ILS practice' },
];

const SEED_EXTERNAL_COSTS: Omit<ExternalCost, 'id'>[] = [
  { date: '2026-06-15', category: 'membership', amount: 150, description: 'Flying club monthly dues' },
  { date: '2026-03-10', category: 'medical', amount: 175, description: '3rd class medical exam' },
  { date: '2026-01-05', category: 'gear', amount: 320, description: 'Bose A20 headset' },
];

export function seedIfEmpty(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.seeded)) return;

  SEED_FLIGHTS.forEach((f) => addFlight(f));
  SEED_AIRCRAFT.forEach((a) => addAircraft(a));
  SEED_FLIGHT_COSTS.forEach((c) => addFlightCost(c));
  SEED_EXTERNAL_COSTS.forEach((c) => addExternalCost(c));

  localStorage.setItem(KEYS.seeded, 'true');
}
