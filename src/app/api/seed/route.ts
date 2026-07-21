export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { flights, aircraft, flightCosts, externalCosts } from '@/lib/schema';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export async function POST() {
  try {
    const existing = await db.select().from(flights).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Already seeded' });
    }

    await db.insert(flights).values([
      { id: uid(), date: '2026-06-28', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KSQL → KPAO', totalTime: 1.2, pic: 1.2, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 0, landings: 3, nightLandings: 0, approaches: 0, comments: 'Pattern work, 3 touch-and-goes' },
      { id: uid(), date: '2026-06-25', aircraft: 'N5251R', model: 'Piper PA-28-181', route: 'KPAO → KWVI → KPAO', totalTime: 2.1, pic: 2.1, sic: 0, dual: 0, night: 0.4, instrument: 0, simInstrument: 0, crossCountry: 2.1, landings: 2, nightLandings: 1, approaches: 0, comments: 'Sunset coastal flight' },
      { id: uid(), date: '2026-06-22', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KSJC → KRHV → KPAO', totalTime: 1.8, pic: 1.8, sic: 0, dual: 0, night: 0, instrument: 0.5, simInstrument: 0, crossCountry: 0, landings: 3, nightLandings: 0, approaches: 2, comments: 'ILS practice with hood' },
      { id: uid(), date: '2026-06-20', aircraft: 'N8520G', model: 'Cessna C182T', route: 'KPAO → KMOD → KPAO', totalTime: 2.5, pic: 2.5, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 2.5, landings: 2, nightLandings: 0, approaches: 0, comments: 'Central valley cross-country' },
      { id: uid(), date: '2026-06-18', aircraft: 'N172SP', model: 'Cessna C172S', route: 'KPAO → KPAO', totalTime: 1.0, pic: 1.0, sic: 0, dual: 0, night: 0, instrument: 0, simInstrument: 0, crossCountry: 0, landings: 5, nightLandings: 0, approaches: 0, comments: 'Solo pattern practice' },
    ]);

    await db.insert(aircraft).values([
      { id: uid(), tailNumber: 'N172SP', model: 'Cessna C172S Skyhawk SP', year: 2005, category: 'Single Engine Land', notes: 'Primary trainer', imageColor: '#0ea5e9' },
      { id: uid(), tailNumber: 'N5251R', model: 'Piper PA-28-181 Archer III', year: 2003, category: 'Single Engine Land', notes: 'Cross-country favorite', imageColor: '#22c55e' },
      { id: uid(), tailNumber: 'N8520G', model: 'Cessna C182T Skylane', year: 2008, category: 'Single Engine Land', notes: 'High performance', imageColor: '#f59e0b' },
    ]);

    await db.insert(flightCosts).values([
      { id: uid(), flightId: '', date: '2026-06-28', aircraft: 'N172SP', fuelCost: 45, rentalCost: 185, instructorCost: 0, landingFees: 0, otherCost: 0, notes: 'Pattern work' },
      { id: uid(), flightId: '', date: '2026-06-25', aircraft: 'N5251R', fuelCost: 78, rentalCost: 315, instructorCost: 0, landingFees: 12, otherCost: 0, notes: 'Coastal flight' },
      { id: uid(), flightId: '', date: '2026-06-22', aircraft: 'N172SP', fuelCost: 55, rentalCost: 270, instructorCost: 65, landingFees: 0, otherCost: 0, notes: 'ILS practice' },
    ]);

    await db.insert(externalCosts).values([
      { id: uid(), date: '2026-06-15', category: 'membership', amount: 150, description: 'Flying club monthly dues' },
      { id: uid(), date: '2026-03-10', category: 'medical', amount: 175, description: '3rd class medical exam' },
      { id: uid(), date: '2026-01-05', category: 'gear', amount: 320, description: 'Bose A20 headset' },
    ]);

    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
