export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import fs from 'fs';

export async function GET() {
  try {
    const checks: any = {
      nodeVersion: process.version,
      vercel: !!process.env.VERCEL,
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      tmpExists: fs.existsSync('/tmp'),
      tmpWritable: false,
      dataDir: '',
      dbRead: false,
      dbCounts: {},
    };

    try {
      fs.writeFileSync('/tmp/test-write.txt', 'test');
      checks.tmpWritable = true;
      fs.unlinkSync('/tmp/test-write.txt');
    } catch (e: any) {
      checks.tmpWritable = false;
      checks.tmpError = e?.message;
    }

    try {
      const db = readDB();
      checks.dbRead = true;
      checks.dataDir = 'ok';
      checks.dbCounts = {
        users: db.users.length,
        businesses: db.businesses.length,
        admin_users: db.admin_users.length,
        plans: db.plans.length,
      };
    } catch (e: any) {
      checks.dbRead = false;
      checks.dbError = e?.message;
      checks.dbStack = e?.stack;
    }

    return NextResponse.json({ success: true, checks });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message, stack: e?.stack }, { status: 500 });
  }
}
