export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { readDB } from '@/lib/db';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = readDB();
  return NextResponse.json(db);
}
