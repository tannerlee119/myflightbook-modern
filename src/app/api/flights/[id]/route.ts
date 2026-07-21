import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { flights, flightCosts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const [row] = await db.update(flights).set(body).where(eq(flights.id, id)).returning();
    return NextResponse.json({ flight: row });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(flightCosts).where(eq(flightCosts.flightId, id));
    await db.delete(flights).where(eq(flights.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
