export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { flights, flightCosts, externalCosts } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allFlights = await db.select().from(flights).orderBy(desc(flights.date));
    const allFlightCosts = await db.select().from(flightCosts).orderBy(desc(flightCosts.date));
    const allExternalCosts = await db.select().from(externalCosts).orderBy(desc(externalCosts.date));

    // Totals
    const totals = {
      totalTime: 0, pic: 0, sic: 0, dual: 0, dualGiven: 0, night: 0,
      instrument: 0, simInstrument: 0, crossCountry: 0,
      landings: 0, nightLandings: 0, approaches: 0, flightCount: allFlights.length,
    };
    for (const f of allFlights) {
      totals.totalTime += f.totalTime ?? 0;
      totals.pic += f.pic ?? 0;
      totals.sic += f.sic ?? 0;
      totals.dual += f.dual ?? 0;
      totals.dualGiven += f.dualGiven ?? 0;
      totals.night += f.night ?? 0;
      totals.instrument += f.instrument ?? 0;
      totals.simInstrument += f.simInstrument ?? 0;
      totals.crossCountry += f.crossCountry ?? 0;
      totals.landings += f.landings ?? 0;
      totals.nightLandings += f.nightLandings ?? 0;
      totals.approaches += f.approaches ?? 0;
    }

    // Currency
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyStr = ninetyDaysAgo.toISOString().split('T')[0];
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixStr = sixMonthsAgo.toISOString().split('T')[0];

    const recent = allFlights.filter((f) => f.date >= ninetyStr);
    const recentLandings = recent.reduce((s, f) => s + (f.landings ?? 0), 0);
    const recentNightLandings = recent.reduce((s, f) => s + (f.nightLandings ?? 0), 0);
    const recentApproaches = allFlights.filter((f) => f.date >= sixStr).reduce((s, f) => s + (f.approaches ?? 0), 0);

    const currency = [
      { name: 'Day Passenger Currency', status: recentLandings >= 3 ? 'current' : recentLandings >= 1 ? 'warning' : 'expired', detail: `${recentLandings} of 3 landings in last 90 days` },
      { name: 'Night Passenger Currency', status: recentNightLandings >= 3 ? 'current' : recentNightLandings >= 1 ? 'warning' : 'expired', detail: `${recentNightLandings} of 3 night full-stop landings in 90 days` },
      { name: 'Instrument Currency (FAR 61.57)', status: recentApproaches >= 6 ? 'current' : recentApproaches >= 3 ? 'warning' : 'expired', detail: `${recentApproaches} of 6 approaches in last 6 months` },
    ];

    // Cost summary
    const fcSum = (list: typeof allFlightCosts) => list.reduce((s, c) => s + (c.fuelCost ?? 0) + (c.rentalCost ?? 0) + (c.instructorCost ?? 0) + (c.landingFees ?? 0) + (c.otherCost ?? 0), 0);
    const ecSum = (list: typeof allExternalCosts) => list.reduce((s, c) => s + (c.amount ?? 0), 0);
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const yearStart = `${now.getFullYear()}-01-01`;

    const costSummary = {
      allTimeFlightCosts: fcSum(allFlightCosts),
      allTimeExternalCosts: ecSum(allExternalCosts),
      allTimeTotal: fcSum(allFlightCosts) + ecSum(allExternalCosts),
      monthFlightCosts: fcSum(allFlightCosts.filter((c) => c.date >= monthStart)),
      monthExternalCosts: ecSum(allExternalCosts.filter((c) => c.date >= monthStart)),
      monthTotal: fcSum(allFlightCosts.filter((c) => c.date >= monthStart)) + ecSum(allExternalCosts.filter((c) => c.date >= monthStart)),
      yearFlightCosts: fcSum(allFlightCosts.filter((c) => c.date >= yearStart)),
      yearExternalCosts: ecSum(allExternalCosts.filter((c) => c.date >= yearStart)),
      yearTotal: fcSum(allFlightCosts.filter((c) => c.date >= yearStart)) + ecSum(allExternalCosts.filter((c) => c.date >= yearStart)),
    };

    return NextResponse.json({ totals, currency, costSummary });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
