export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { flightCosts } from '@/lib/schema';
import { desc } from 'drizzle-orm';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export async function GET() {
  try {
    const rows = await db.select().from(flightCosts).orderBy(desc(flightCosts.date));
    return NextResponse.json({ costs: rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = uid();
    const [row] = await db.insert(flightCosts).values({ id, ...body }).returning();
    return NextResponse.json({ cost: row });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
