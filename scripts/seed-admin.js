import { upsertStaffUser } from '../api/_lib/database.js';

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'change-me';
const displayName = process.env.ADMIN_DISPLAY_NAME || 'Site Administrator';

if (!username || !password) {
  console.error('ADMIN_USERNAME and ADMIN_PASSWORD are required to seed a staff user.');
  process.exit(1);
}

const user = upsertStaffUser({
  username,
  password,
  displayName,
  role: 'admin'
});

console.log(`Seeded staff user: ${user.username} (${user.displayName})`);
