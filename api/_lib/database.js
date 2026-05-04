import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashPassword, verifyPassword } from './passwords.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDbPath = path.join(os.tmpdir(), 'everest.sqlite');

let database;

function getSeedUsername() {
  return process.env.ADMIN_USERNAME || (process.env.NODE_ENV === 'production' ? '' : 'admin');
}

function getSeedPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'change-me');
}

function getSeedDisplayName(username) {
  if (!username) {
    return '';
  }

  if (username === 'admin') {
    return 'Site Administrator';
  }

  return username
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function hydrateStaffUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function seedDefaultStaffUser(db) {
  const username = getSeedUsername();
  const password = getSeedPassword();

  if (!username || !password) {
    return;
  }

  const timestamp = new Date().toISOString();
  const payload = {
    id: `staff_${Date.now()}`,
    username,
    password_hash: hashPassword(password),
    display_name: getSeedDisplayName(username),
    role: 'admin',
    created_at: timestamp,
    updated_at: timestamp
  };

  db.prepare(`
    INSERT INTO staff_users (id, username, password_hash, display_name, role, created_at, updated_at)
    VALUES (@id, @username, @password_hash, @display_name, @role, @created_at, @updated_at)
    ON CONFLICT(username) DO UPDATE SET
      password_hash = excluded.password_hash,
      updated_at = excluded.updated_at
  `).run(payload);
}

function ensureDatabase() {
  if (database) {
    return database;
  }

  const filePath = process.env.INQUIRY_DB_FILE || defaultDbPath;
  mkdirSync(path.dirname(filePath), { recursive: true });

  database = new Database(filePath);
  database.pragma('journal_mode = WAL');

  database.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      party_size INTEGER NOT NULL,
      trip_type TEXT NOT NULL,
      budget_band TEXT NOT NULL,
      destination_interests TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      flexible_dates INTEGER NOT NULL DEFAULT 0,
      accommodations TEXT,
      special_occasion TEXT,
      special_requests TEXT NOT NULL,
      consent INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL DEFAULT 'website',
      client_ip TEXT,
      received_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      crm_status TEXT NOT NULL DEFAULT 'pending',
      assigned_to TEXT,
      admin_notes TEXT,
      webhook_delivered INTEGER NOT NULL DEFAULT 0,
      webhook_error TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_inquiries_received_at ON inquiries(received_at DESC);
    CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

    CREATE TABLE IF NOT EXISTS staff_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      short_title TEXT NOT NULL,
      country TEXT NOT NULL,
      region TEXT NOT NULL,
      eyebrow TEXT NOT NULL,
      meta TEXT NOT NULL,
      rating TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      card_image TEXT NOT NULL,
      gallery_json TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      ideal_for_json TEXT NOT NULL,
      highlights_json TEXT NOT NULL,
      itinerary_json TEXT NOT NULL,
      best_season TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      eyebrow TEXT NOT NULL,
      short_title TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      bullets_json TEXT NOT NULL,
      inclusions_json TEXT NOT NULL,
      best_for_json TEXT NOT NULL,
      destination_slugs_json TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_staff_users_username ON staff_users(username);
    CREATE INDEX IF NOT EXISTS idx_destinations_id ON destinations(id);
    CREATE INDEX IF NOT EXISTS idx_experiences_id ON experiences(id);
  `);

  seedDefaultStaffUser(database);
  seedCatalogs(database);

  return database;
}

/**
 * Automatically seeds the database with content from siteContent.js if tables are empty.
 */
async function seedCatalogs(db) {
  const destCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
  if (destCount === 0) {
    try {
      // In a real ESM environment, we'd import dynamically, but since we are seeding from a known static file
      // we will use the siteContent we just read or a simplified version if import is hard.
      // For this environment, I'll provide a helper that converts the static data to DB rows.
      const { destinations, experiences } = await import('../../src/data/siteContent.js');
      
      const insertDest = db.prepare(`
        INSERT INTO destinations (
          id, title, short_title, country, region, eyebrow, meta, rating, 
          hero_image, card_image, gallery_json, summary, description, 
          ideal_for_json, highlights_json, itinerary_json, best_season, seo_description, updated_at
        ) VALUES (
          @slug, @title, @shortTitle, @country, @region, @eyebrow, @meta, @rating,
          @heroImage, @cardImage, @gallery_json, @summary, @description,
          @ideal_for_json, @highlights_json, @itinerary_json, @bestSeason, @seoDescription, @updatedAt
        )
      `);

      const insertExp = db.prepare(`
        INSERT INTO experiences (
          id, title, eyebrow, short_title, hero_image, summary, description,
          bullets_json, inclusions_json, best_for_json, destination_slugs_json, seo_description, updated_at
        ) VALUES (
          @slug, @title, @eyebrow, @shortTitle, @heroImage, @summary, @description,
          @bullets_json, @inclusions_json, @best_for_json, @destination_slugs_json, @seoDescription, @updatedAt
        )
      `);

      const timestamp = new Date().toISOString();

      destinations.forEach(dest => {
        insertDest.run({
          ...dest,
          gallery_json: JSON.stringify(dest.gallery || []),
          ideal_for_json: JSON.stringify(dest.idealFor || []),
          highlights_json: JSON.stringify(dest.highlights || []),
          itinerary_json: JSON.stringify(dest.itinerary || []),
          updatedAt: timestamp
        });
      });

      experiences.forEach(exp => {
        insertExp.run({
          ...exp,
          bullets_json: JSON.stringify(exp.bullets || []),
          inclusions_json: JSON.stringify(exp.inclusions || []),
          best_for_json: JSON.stringify(exp.bestFor || []),
          destination_slugs_json: JSON.stringify(exp.destinationSlugs || []),
          updatedAt: timestamp
        });
      });

      console.log('Database seeded with destinations and experiences.');
    } catch (err) {
      console.error('Failed to seed database from siteContent.js:', err);
    }
  }
}

export function insertInquiryRecord(payload) {
  const db = ensureDatabase();
  const statement = db.prepare(`
    INSERT INTO inquiries (
      id, full_name, email, phone, party_size, trip_type, budget_band, destination_interests,
      start_date, end_date, flexible_dates, accommodations, special_occasion, special_requests,
      consent, source, client_ip, received_at, status, crm_status, assigned_to, admin_notes,
      webhook_delivered, webhook_error, updated_at
    ) VALUES (
      @id, @full_name, @email, @phone, @party_size, @trip_type, @budget_band, @destination_interests,
      @start_date, @end_date, @flexible_dates, @accommodations, @special_occasion, @special_requests,
      @consent, @source, @client_ip, @received_at, @status, @crm_status, @assigned_to, @admin_notes,
      @webhook_delivered, @webhook_error, @updated_at
    )
  `);

  statement.run(payload);
}

function hydrateInquiry(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    partySize: row.party_size,
    tripType: row.trip_type,
    budgetBand: row.budget_band,
    destinationInterests: JSON.parse(row.destination_interests || '[]'),
    startDate: row.start_date,
    endDate: row.end_date,
    flexibleDates: Boolean(row.flexible_dates),
    accommodations: row.accommodations,
    specialOccasion: row.special_occasion,
    specialRequests: row.special_requests,
    consent: Boolean(row.consent),
    source: row.source,
    clientIp: row.client_ip,
    receivedAt: row.received_at,
    status: row.status,
    crmStatus: row.crm_status,
    assignedTo: row.assigned_to,
    adminNotes: row.admin_notes,
    webhookDelivered: Boolean(row.webhook_delivered),
    webhookError: row.webhook_error,
    updatedAt: row.updated_at
  };
}

export function listInquiryRecords({ query = '', status = 'all', limit = 100 } = {}) {
  const db = ensureDatabase();
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 200);
  const params = [];
  const filters = [];

  if (status && status !== 'all') {
    filters.push('status = ?');
    params.push(status);
  }

  if (query) {
    filters.push('(full_name LIKE ? OR email LIKE ? OR trip_type LIKE ? OR destination_interests LIKE ?)');
    const like = `%${query}%`;
    params.push(like, like, like, like);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const statement = db.prepare(`
    SELECT * FROM inquiries
    ${whereClause}
    ORDER BY received_at DESC
    LIMIT ?
  `);

  const rows = statement.all(...params, safeLimit);
  return rows.map(hydrateInquiry);
}

export function searchInquiries(query) {
  const db = ensureDatabase();
  const search = `%${query}%`;
  const statement = db.prepare(`
    SELECT * FROM inquiries 
    WHERE full_name LIKE ? 
    OR email LIKE ? 
    OR trip_type LIKE ?
    ORDER BY received_at DESC 
    LIMIT 10
  `);
  return statement.all(search, search, search).map(hydrateInquiry);
}

export function getInquiryRecord(id) {
  const db = ensureDatabase();
  const statement = db.prepare('SELECT * FROM inquiries WHERE id = ? LIMIT 1');
  return hydrateInquiry(statement.get(id));
}

export function getInquiryStats() {
  const db = ensureDatabase();
  const rows = db.prepare('SELECT status, COUNT(*) AS count FROM inquiries GROUP BY status').all();

  return rows.reduce(
    (accumulator, row) => ({
      ...accumulator,
      [row.status]: row.count
    }),
    { total: rows.reduce((sum, row) => sum + row.count, 0) }
  );
}

export function getDashboardStats() {
  const db = ensureDatabase();

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // Daily Metrics: Last 7 days
  const dailyMetrics = [];
  const revenueMap = { 'under-5k': 3000, '5k-10k': 7500, '10k-25k': 17500, '25k-plus': 35000 };

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];

    const stats = db.prepare(`
      SELECT COUNT(*) as count, budget_band 
      FROM inquiries 
      WHERE date(received_at) = ? 
      GROUP BY budget_band
    `).all(dayStr);

    const dayCount = stats.reduce((sum, s) => sum + s.count, 0);
    const dayRevenue = stats.reduce((sum, s) => sum + (revenueMap[s.budget_band] || 0) * s.count, 0);

    dailyMetrics.push({
      day: dayStr,
      count: dayCount,
      revenue: dayRevenue
    });
  }

  // Trends calculation
  const currentWeekCount = db.prepare('SELECT COUNT(*) as count FROM inquiries WHERE received_at >= ?').get(sevenDaysAgo.toISOString()).count;
  const previousWeekCount = db.prepare('SELECT COUNT(*) as count FROM inquiries WHERE received_at >= ? AND received_at < ?').get(fourteenDaysAgo.toISOString(), sevenDaysAgo.toISOString()).count;
  const volumeTrend = previousWeekCount === 0 ? 100 : Math.round(((currentWeekCount - previousWeekCount) / previousWeekCount) * 100);

  const getTotalRevenue = (start, end) => {
    let q = 'SELECT budget_band, COUNT(*) as count FROM inquiries WHERE received_at >= ?';
    let p = [start];
    if (end) { q += ' AND received_at < ?'; p.push(end); }
    q += ' GROUP BY budget_band';
    return db.prepare(q).all(...p).reduce((sum, row) => sum + (revenueMap[row.budget_band] || 0) * row.count, 0);
  };

  const currentRevenue = getTotalRevenue(sevenDaysAgo.toISOString());
  const previousRevenue = getTotalRevenue(fourteenDaysAgo.toISOString(), sevenDaysAgo.toISOString());
  const revenueTrend = previousRevenue === 0 ? 100 : Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);

  // Destinations: Top 5
  const destinationRows = db.prepare('SELECT destination_interests FROM inquiries').all();
  const destCounts = {};
  destinationRows.forEach((row) => {
    try {
      const interests = JSON.parse(row.destination_interests || '[]');
      interests.forEach((item) => { destCounts[item] = (destCounts[item] || 0) + 1; });
    } catch { /* skip */ }
  });

  const topDestinations = Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    volume: dailyMetrics,
    destinations: topDestinations,
    revenue: currentRevenue,
    trends: {
      volume: volumeTrend,
      revenue: revenueTrend
    },
    summary: getInquiryStats()
  };
}

export function updateInquiryRecord(id, update) {
  const db = ensureDatabase();
  const updates = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(update, 'status')) {
    updates.push('status = ?');
    values.push(update.status);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'crmStatus')) {
    updates.push('crm_status = ?');
    values.push(update.crmStatus);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'assignedTo')) {
    updates.push('assigned_to = ?');
    values.push(update.assignedTo || null);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'adminNotes')) {
    updates.push('admin_notes = ?');
    values.push(update.adminNotes || null);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'webhookDelivered')) {
    updates.push('webhook_delivered = ?');
    values.push(update.webhookDelivered ? 1 : 0);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'webhookError')) {
    updates.push('webhook_error = ?');
    values.push(update.webhookError || null);
  }

  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);

  db.prepare(`UPDATE inquiries SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  return getInquiryRecord(id);
}

export function getStaffUserByUsername(username) {
  const db = ensureDatabase();
  const statement = db.prepare('SELECT * FROM staff_users WHERE username = ? LIMIT 1');
  return hydrateStaffUser(statement.get(username));
}

export function verifyStaffUserCredentials(username, password) {
  const db = ensureDatabase();
  const row = db.prepare('SELECT * FROM staff_users WHERE username = ? LIMIT 1').get(String(username ?? '').trim());

  if (!row || !verifyPassword(password, row.password_hash)) {
    return null;
  }

  return hydrateStaffUser(row);
}

export function upsertStaffUser({ username, password, displayName, role = 'admin' }) {
  const db = ensureDatabase();
  const normalizedUsername = String(username ?? '').trim();
  const normalizedPassword = String(password ?? '');

  if (!normalizedUsername || !normalizedPassword) {
    throw new Error('Username and password are required to create a staff user.');
  }

  const timestamp = new Date().toISOString();
  const existing = db.prepare('SELECT id FROM staff_users WHERE username = ? LIMIT 1').get(normalizedUsername);

  const payload = {
    id: existing?.id ?? `staff_${Date.now()}`,
    username: normalizedUsername,
    password_hash: hashPassword(normalizedPassword),
    display_name: String(displayName ?? '').trim() || getSeedDisplayName(normalizedUsername),
    role,
    created_at: timestamp,
    updated_at: timestamp
  };

  db.prepare(`
    INSERT INTO staff_users (id, username, password_hash, display_name, role, created_at, updated_at)
    VALUES (@id, @username, @password_hash, @display_name, @role, @created_at, @updated_at)
    ON CONFLICT(username) DO UPDATE SET
      password_hash = excluded.password_hash,
      display_name = excluded.display_name,
      role = excluded.role,
      updated_at = excluded.updated_at
  `).run(payload);

  return getStaffUserByUsername(normalizedUsername);
}

export function resetInquiryDatabase() {
  if (!database) {
    return;
  }

  database.close();
  database = undefined;
}

function hydrateDestination(row) {
  if (!row) return null;
  return {
    slug: row.id,
    title: row.title,
    shortTitle: row.short_title,
    country: row.country,
    region: row.region,
    eyebrow: row.eyebrow,
    meta: row.meta,
    rating: row.rating,
    heroImage: row.hero_image,
    cardImage: row.card_image,
    gallery: JSON.parse(row.gallery_json || '[]'),
    summary: row.summary,
    description: row.description,
    idealFor: JSON.parse(row.ideal_for_json || '[]'),
    highlights: JSON.parse(row.highlights_json || '[]'),
    itinerary: JSON.parse(row.itinerary_json || '[]'),
    bestSeason: row.best_season,
    seoDescription: row.seo_description,
    updatedAt: row.updated_at
  };
}

function hydrateExperience(row) {
  if (!row) return null;
  return {
    slug: row.id,
    title: row.title,
    eyebrow: row.eyebrow,
    shortTitle: row.short_title,
    heroImage: row.hero_image,
    summary: row.summary,
    description: row.description,
    bullets: JSON.parse(row.bullets_json || '[]'),
    inclusions: JSON.parse(row.inclusions_json || '[]'),
    bestFor: JSON.parse(row.best_for_json || '[]'),
    destinationSlugs: JSON.parse(row.destination_slugs_json || '[]'),
    seoDescription: row.seo_description,
    updatedAt: row.updated_at
  };
}

export function listDestinationRecords() {
  const db = ensureDatabase();
  const rows = db.prepare('SELECT * FROM destinations ORDER BY id ASC').all();
  return rows.map(hydrateDestination);
}

export function saveDestinationRecord(payload) {
  const db = ensureDatabase();
  const timestamp = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO destinations (
      id, title, short_title, country, region, eyebrow, meta, rating,
      hero_image, card_image, gallery_json, summary, description,
      ideal_for_json, highlights_json, itinerary_json, best_season, seo_description, updated_at
    ) VALUES (
      @slug, @title, @shortTitle, @country, @region, @eyebrow, @meta, @rating,
      @heroImage, @cardImage, @gallery_json, @summary, @description,
      @ideal_for_json, @highlights_json, @itinerary_json, @bestSeason, @seoDescription, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      short_title = excluded.short_title,
      country = excluded.country,
      region = excluded.region,
      eyebrow = excluded.eyebrow,
      meta = excluded.meta,
      rating = excluded.rating,
      hero_image = excluded.hero_image,
      card_image = excluded.card_image,
      gallery_json = excluded.gallery_json,
      summary = excluded.summary,
      description = excluded.description,
      ideal_for_json = excluded.ideal_for_json,
      highlights_json = excluded.highlights_json,
      itinerary_json = excluded.itinerary_json,
      best_season = excluded.best_season,
      seo_description = excluded.seo_description,
      updated_at = excluded.updated_at
  `);

  stmt.run({
    ...payload,
    gallery_json: JSON.stringify(payload.gallery || []),
    ideal_for_json: JSON.stringify(payload.idealFor || []),
    highlights_json: JSON.stringify(payload.highlights || []),
    itinerary_json: JSON.stringify(payload.itinerary || []),
    updatedAt: timestamp
  });

  const row = db.prepare('SELECT * FROM destinations WHERE id = ?').get(payload.slug);
  return hydrateDestination(row);
}

export function listExperienceRecords() {
  const db = ensureDatabase();
  const rows = db.prepare('SELECT * FROM experiences ORDER BY id ASC').all();
  return rows.map(hydrateExperience);
}

export function saveExperienceRecord(payload) {
  const db = ensureDatabase();
  const timestamp = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO experiences (
      id, title, eyebrow, short_title, hero_image, summary, description,
      bullets_json, inclusions_json, best_for_json, destination_slugs_json, seo_description, updated_at
    ) VALUES (
      @slug, @title, @eyebrow, @shortTitle, @heroImage, @summary, @description,
      @bullets_json, @inclusions_json, @best_for_json, @destination_slugs_json, @seoDescription, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      eyebrow = excluded.eyebrow,
      short_title = excluded.short_title,
      hero_image = excluded.hero_image,
      summary = excluded.summary,
      description = excluded.description,
      bullets_json = excluded.bullets_json,
      inclusions_json = excluded.inclusions_json,
      best_for_json = excluded.best_for_json,
      destination_slugs_json = excluded.destination_slugs_json,
      seo_description = excluded.seo_description,
      updated_at = excluded.updated_at
  `);

  stmt.run({
    ...payload,
    bullets_json: JSON.stringify(payload.bullets || []),
    inclusions_json: JSON.stringify(payload.inclusions || []),
    best_for_json: JSON.stringify(payload.bestFor || []),
    destination_slugs_json: JSON.stringify(payload.destinationSlugs || []),
    updatedAt: timestamp
  });

  const row = db.prepare('SELECT * FROM experiences WHERE id = ?').get(payload.slug);
  return hydrateExperience(row);
}
