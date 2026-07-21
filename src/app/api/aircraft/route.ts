export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aircraft } from '@/lib/schema';
import { asc } from 'drizzle-orm';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export async function GET() {
  try {
    const rows = await db.select().from(aircraft).orderBy(asc(aircraft.tailNumber));
    return NextResponse.json({ aircraft: rows });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = uid();
    const [row] = await db.insert(aircraft).values({ id, ...body }).returning();
    return NextResponse.json({ aircraft: row });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
