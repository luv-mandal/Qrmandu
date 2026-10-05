import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Vercel has read-only filesystem except /tmp
const IS_VERCEL = !!process.env.VERCEL;
const BASE_DATA_DIR = IS_VERCEL ? '/tmp/qrmandu-data' : path.join(process.cwd(), 'data');
const FALLBACK_DATA_DIR = '/tmp/qrmandu-data';
const DB_FILE = path.join(BASE_DATA_DIR, 'db.json');
const FALLBACK_DB_FILE = path.join(FALLBACK_DATA_DIR, 'db.json');

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

// Pre-hashed admin123 for Vercel compatibility (no async init needed)
const ADMIN_HASH = '$2a$10$XAdHcm4CxY70x56NJIa1Hu6gUNDvnpIwQ8yuPmZIGAM8g1mdvaaNW';

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
    {
      id: 'admin-default-id',
      email: 'admin@qrmandu.com',
      password_hash: ADMIN_HASH,
      role: 'super_admin',
      created_at: new Date().toISOString(),
    }
  ],
  audit_logs: [],
};

// In-memory fallback for serverless environments where FS is ephemeral
// Use globalThis to persist across hot reloads and serverless container reuse
const globalForDB = globalThis as unknown as { __qrmandu_memoryDB: DB | null };
let memoryDB: DB | null = globalForDB.__qrmandu_memoryDB || null;

function setMemoryDB(db: DB) {
  memoryDB = db;
  globalForDB.__qrmandu_memoryDB = db;
}

function getDataDir() {
  // Try primary, fallback to /tmp
  try {
    if (!fs.existsSync(BASE_DATA_DIR)) fs.mkdirSync(BASE_DATA_DIR, { recursive: true });
    return BASE_DATA_DIR;
  } catch {
    try {
      if (!fs.existsSync(FALLBACK_DATA_DIR)) fs.mkdirSync(FALLBACK_DATA_DIR, { recursive: true });
      return FALLBACK_DATA_DIR;
    } catch {
      return FALLBACK_DATA_DIR;
    }
  }
}

function getDbFile() {
  const dir = getDataDir();
  return path.join(dir, 'db.json');
}

function ensureDataDir() {
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = getDbFile();
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(DEFAULT_DB, null, 2));
      setMemoryDB(JSON.parse(JSON.stringify(DEFAULT_DB)));
    }
  } catch (e) {
    // If FS fails completely, use memory
    if (!memoryDB) setMemoryDB(JSON.parse(JSON.stringify(DEFAULT_DB)));
  }
}

export function readDB(): DB {
  // If we have memoryDB and are on Vercel, prefer memory if file fails
  try {
    ensureDataDir();
    const file = getDbFile();
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.plans || parsed.plans.length === 0) parsed.plans = DEFAULT_DB.plans;
      if (!parsed.admin_users || parsed.admin_users.length === 0) parsed.admin_users = DEFAULT_DB.admin_users;
      // Sync to memory
      setMemoryDB(parsed);
      return parsed as DB;
    }
  } catch (e) {
    // Fall through to memory
  }
  if (memoryDB) {
    if (!memoryDB.plans || memoryDB.plans.length === 0) memoryDB.plans = DEFAULT_DB.plans;
    if (!memoryDB.admin_users || memoryDB.admin_users.length === 0) memoryDB.admin_users = DEFAULT_DB.admin_users;
    return memoryDB as DB;
  }
  const fresh = JSON.parse(JSON.stringify(DEFAULT_DB));
  setMemoryDB(fresh);
  return fresh as DB;
}

export function writeDB(db: DB) {
  setMemoryDB(db);
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = getDbFile();
    fs.writeFileSync(file, JSON.stringify(db, null, 2));
  } catch (e) {
    // On Vercel, /tmp write should succeed, but if not, keep in memory
    console.warn('DB write to FS failed, using memory only', e);
  }
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

export function ensureBusinessOwnership(businessId: string, userId: string) {
  const biz = findOne('businesses', (b) => b.id === businessId);
  if (!biz) return null;
  if (biz.user_id !== userId) return null;
  return biz;
}

export async function initAdmin() {
  try {
    const bcrypt = await import('bcryptjs');
    const db = readDB();
    if (!db.admin_users || db.admin_users.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      db.admin_users.push({
        id: uuidv4(),
        email: 'admin@qrmandu.com',
        password_hash: hash,
        role: 'super_admin',
        created_at: new Date().toISOString(),
      });
      writeDB(db);
    } else {
      // Ensure default admin exists
      const exists = db.admin_users.find((a:any)=>a.email==='admin@qrmandu.com');
      if (!exists) {
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
  } catch {}
}

if (typeof window === 'undefined') {
  try {
    ensureDataDir();
    // Don't await, but ensure memoryDB initialized
    if (!memoryDB) setMemoryDB(JSON.parse(JSON.stringify(DEFAULT_DB)));
    initAdmin().catch(() => {});
  } catch {}
}
