import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

type DB = {
  users: any[];
  businesses: any[];
  qr_codes: any[];
  review_sessions: any[];
  subscriptions: any[];
  plans: any[];
  coupons: any[];
  payments: any[];
  analytics_events: any[];
  admin_users: any[];
  audit_logs: any[];
};

const DEFAULT_DB: DB = {
  users: [],
  businesses: [],
  qr_codes: [],
  review_sessions: [],
  subscriptions: [],
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      price: 999,
      priceLabel: 'Rs 999',
      duration: '1 month',
      qr_limit: 1,
      features: ['1 QR code', 'Up to 200 scans/month', 'Basic analytics', 'Email support'],
      recommended: false,
      whatsappMessage: 'Hello QRmandu, I want to subscribe to the Starter plan',
    },
    {
      id: 'business',
      name: 'Business',
      price: 1999,
      priceLabel: 'Rs 1,999',
      duration: '1 month',
      qr_limit: 5,
      features: ['5 QR codes', 'Unlimited scans', 'Advanced analytics', 'Priority support', 'Custom branding'],
      recommended: true,
      whatsappMessage: 'Hello QRmandu, I want to subscribe to the Business plan',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 2999,
      priceLabel: 'Rs 2,999',
      duration: '1 month',
      qr_limit: 20,
      features: ['20 QR codes', 'Unlimited scans', 'Advanced analytics + export', 'Dedicated support', 'API access', 'White-label option'],
      recommended: false,
      whatsappMessage: 'Hello QRmandu, I want to subscribe to the Premium plan',
    }
  ],
  coupons: [],
  payments: [],
  analytics_events: [],
  admin_users: [
    // default admin: admin@qrmandu.com / admin123 - hashed later on init
  ],
  audit_logs: [],
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

export function readDB(): DB {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // ensure plans exist
    if (!parsed.plans || parsed.plans.length === 0) parsed.plans = DEFAULT_DB.plans;
    return parsed as DB;
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
}

export function writeDB(db: DB) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getCollection<T = any>(name: keyof DB): T[] {
  const db = readDB();
  return db[name] as T[];
}

export function setCollection(name: keyof DB, data: any[]) {
  const db = readDB();
  (db as any)[name] = data;
  writeDB(db);
}

export function insertOne(collection: keyof DB, doc: any) {
  const db = readDB();
  const col = db[collection] as any[];
  const newDoc = { id: doc.id || uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...doc };
  col.push(newDoc);
  writeDB(db);
  return newDoc;
}

export function findOne(collection: keyof DB, predicate: (d: any) => boolean) {
  const db = readDB();
  return (db[collection] as any[]).find(predicate) || null;
}

export function findMany(collection: keyof DB, predicate?: (d: any) => boolean) {
  const db = readDB();
  const col = db[collection] as any[];
  if (!predicate) return col;
  return col.filter(predicate);
}

export function updateOne(collection: keyof DB, id: string, updates: any) {
  const db = readDB();
  const col = db[collection] as any[];
  const idx = col.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  col[idx] = { ...col[idx], ...updates, updated_at: new Date().toISOString() };
  writeDB(db);
  return col[idx];
}

export function deleteOne(collection: keyof DB, id: string) {
  const db = readDB();
  const col = db[collection] as any[];
  const filtered = col.filter((d) => d.id !== id);
  (db as any)[collection] = filtered;
  writeDB(db);
  return true;
}

// Helpers for business ownership check
export function ensureBusinessOwnership(businessId: string, userId: string) {
  const biz = findOne('businesses', (b) => b.id === businessId);
  if (!biz) return null;
  if (biz.user_id !== userId) return null;
  return biz;
}

export async function initAdmin() {
  const bcrypt = await import('bcryptjs');
  const db = readDB();
  if (db.admin_users.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    db.admin_users.push({
      id: uuidv4(),
      email: 'admin@qrmandu.com',
      password_hash: hash,
      role: 'super_admin',
      created_at: new Date().toISOString(),
    });
    writeDB(db);
  }
}

// Initialize on import (server side)
if (typeof window === 'undefined') {
  try {
    ensureDataDir();
    initAdmin().catch(() => {});
  } catch {}
}
