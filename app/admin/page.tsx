import { getCurrentAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { readDB } from '@/lib/db';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== 'admin') redirect('/admin/login');

  const db = readDB();

  return <AdminClient initialData={db} admin={admin} />;
}
