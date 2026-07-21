// ============================================
// API client layer — replaces localStorage calls
// ============================================

// ---------- Types (re-exported for compatibility) ----------

export interface Flight {
  id: string;
  date: string;
  aircraft: string;
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
  flightId: string;
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
  | 'medical' | 'insurance' | 'training-materials' | 'checkride'
  | 'ground-school' | 'membership' | 'gear' | 'misc';

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

export interface FlightTotals {
  totalTime: number; pic: number; sic: number; dual: number;
  night: number; instrument: number; simInstrument: number;
  crossCountry: number; landings: number; nightLandings: number;
  approaches: number; flightCount: number;
}

export interface CurrencyItem {
  name: string;
  status: 'current' | 'warning' | 'expired' | 'unknown';
  detail: string;
}

export interface CostSummary {
  allTimeFlightCosts: number; allTimeExternalCosts: number; allTimeTotal: number;
  monthFlightCosts: number; monthExternalCosts: number; monthTotal: number;
  yearFlightCosts: number; yearExternalCosts: number; yearTotal: number;
}

// ---------- API Helpers ----------

async function json<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...opts });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function post<T>(url: string, body: unknown): Promise<T> {
  return json<T>(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

function put<T>(url: string, body: unknown): Promise<T> {
  return json<T>(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

function del<T>(url: string): Promise<T> {
  return json<T>(url, { method: 'DELETE' });
}

// ---------- Flights ----------

export async function getFlights(): Promise<Flight[]> {
  const { flights } = await json<{ flights: Flight[] }>('/api/flights');
  return flights;
}

export async function addFlight(flight: Omit<Flight, 'id' | 'createdAt'>): Promise<Flight> {
  const { flight: created } = await post<{ flight: Flight }>('/api/flights', flight);
  return created;
}

export async function updateFlight(id: string, updates: Partial<Flight>): Promise<void> {
  await put(`/api/flights/${id}`, updates);
}

export async function deleteFlight(id: string): Promise<void> {
  await del(`/api/flights/${id}`);
}

// ---------- Aircraft ----------

export async function getAircraft(): Promise<Aircraft[]> {
  const { aircraft } = await json<{ aircraft: Aircraft[] }>('/api/aircraft');
  return aircraft;
}

export async function addAircraft(ac: Omit<Aircraft, 'id'>): Promise<Aircraft> {
  const { aircraft: created } = await post<{ aircraft: Aircraft }>('/api/aircraft', ac);
  return created;
}

export async function updateAircraft(id: string, updates: Partial<Aircraft>): Promise<void> {
  await put(`/api/aircraft/${id}`, updates);
}

export async function deleteAircraft(id: string): Promise<void> {
  await del(`/api/aircraft/${id}`);
}

// ---------- Flight Costs ----------

export async function getFlightCosts(): Promise<FlightCost[]> {
  const { costs } = await json<{ costs: FlightCost[] }>('/api/costs/flight');
  return costs;
}

export async function addFlightCost(cost: Omit<FlightCost, 'id'>): Promise<FlightCost> {
  const { cost: created } = await post<{ cost: FlightCost }>('/api/costs/flight', cost);
  return created;
}

export async function updateFlightCost(id: string, updates: Partial<FlightCost>): Promise<void> {
  await put(`/api/costs/flight/${id}`, updates);
}

export async function deleteFlightCost(id: string): Promise<void> {
  await del(`/api/costs/flight/${id}`);
}

// ---------- External Costs ----------

export async function getExternalCosts(): Promise<ExternalCost[]> {
  const { costs } = await json<{ costs: ExternalCost[] }>('/api/costs/external');
  return costs;
}

export async function addExternalCost(cost: Omit<ExternalCost, 'id'>): Promise<ExternalCost> {
  const { cost: created } = await post<{ cost: ExternalCost }>('/api/costs/external', cost);
  return created;
}

export async function updateExternalCost(id: string, updates: Partial<ExternalCost>): Promise<void> {
  await put(`/api/costs/external/${id}`, updates);
}

export async function deleteExternalCost(id: string): Promise<void> {
  await del(`/api/costs/external/${id}`);
}

// ---------- Stats (computed server-side) ----------

export async function getStats(): Promise<{ totals: FlightTotals; currency: CurrencyItem[]; costSummary: CostSummary }> {
  return json('/api/stats');
}

// ---------- Client-side compute helpers (for pages that have data already) ----------

export function computeTotals(flights: Flight[]): FlightTotals {
  return flights.reduce<FlightTotals>(
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
    { totalTime: 0, pic: 0, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 0, landings: 0, nightLandings: 0, approaches: 0, flightCount: 0 }
  );
}

export function computeCurrency(flights: Flight[]): CurrencyItem[] {
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const ninetyStr = ninetyDaysAgo.toISOString().split('T')[0];
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixStr = sixMonthsAgo.toISOString().split('T')[0];

  const recent = flights.filter((f) => f.date >= ninetyStr);
  const recentLandings = recent.reduce((s, f) => s + (f.landings || 0), 0);
  const recentNightLandings = recent.reduce((s, f) => s + (f.nightLandings || 0), 0);
  const recentApproaches = flights.filter((f) => f.date >= sixStr).reduce((s, f) => s + (f.approaches || 0), 0);

  return [
    { name: 'Day Passenger Currency', status: recentLandings >= 3 ? 'current' : recentLandings >= 1 ? 'warning' : 'expired', detail: `${recentLandings} of 3 landings in last 90 days` },
    { name: 'Night Passenger Currency', status: recentNightLandings >= 3 ? 'current' : recentNightLandings >= 1 ? 'warning' : 'expired', detail: `${recentNightLandings} of 3 night full-stop landings in 90 days` },
    { name: 'Instrument Currency (FAR 61.57)', status: recentApproaches >= 6 ? 'current' : recentApproaches >= 3 ? 'warning' : 'expired', detail: `${recentApproaches} of 6 approaches in last 6 months` },
  ];
}

export function computeCostSummary(flightCosts: FlightCost[], externalCosts: ExternalCost[]): CostSummary {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const yearStart = `${now.getFullYear()}-01-01`;

  const fcSum = (list: FlightCost[]) =>
    list.reduce((s, c) => s + c.fuelCost + c.rentalCost + c.instructorCost + c.landingFees + c.otherCost, 0);
  const ecSum = (list: ExternalCost[]) =>
    list.reduce((s, c) => s + c.amount, 0);

  return {
    allTimeFlightCosts: fcSum(flightCosts),
    allTimeExternalCosts: ecSum(externalCosts),
    allTimeTotal: fcSum(flightCosts) + ecSum(externalCosts),
    monthFlightCosts: fcSum(flightCosts.filter((c) => c.date >= monthStart)),
    monthExternalCosts: ecSum(externalCosts.filter((c) => c.date >= monthStart)),
    monthTotal: fcSum(flightCosts.filter((c) => c.date >= monthStart)) + ecSum(externalCosts.filter((c) => c.date >= monthStart)),
    yearFlightCosts: fcSum(flightCosts.filter((c) => c.date >= yearStart)),
    yearExternalCosts: ecSum(externalCosts.filter((c) => c.date >= yearStart)),
    yearTotal: fcSum(flightCosts.filter((c) => c.date >= yearStart)) + ecSum(externalCosts.filter((c) => c.date >= yearStart)),
  };
}
