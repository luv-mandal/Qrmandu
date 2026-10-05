export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('logo') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const allowed = ['image/png','image/jpeg','image/jpg','image/webp'];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Supported: PNG, JPG, WEBP' }, { status: 400 });

  if (file.size > 5*1024*1024) return NextResponse.json({ error: 'File too large, max 5MB' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const IS_VERCEL = !!process.env.VERCEL;

  // On Vercel, store as data URL (no persistent FS) + try /tmp for compatibility
  if (IS_VERCEL) {
    try {
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      // Also try to write to /tmp for /api/uploads serving
      const tmpDir = '/tmp/qrmandu-uploads';
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
      const filename = `${uuidv4()}.${ext}`;
      const filepath = path.join(tmpDir, filename);
      fs.writeFileSync(filepath, buffer);
      // Return data URL for immediate use (works everywhere)
      return NextResponse.json({ success: true, url: dataUrl, filename });
    } catch (e) {
      console.error('Upload error on Vercel', e);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  }

  // Local / non-Vercel: save to public/uploads
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const filename = `${uuidv4()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (e: any) {
    console.error('Upload error', e);
    // Fallback to data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ success: true, url: dataUrl });
  }
}
