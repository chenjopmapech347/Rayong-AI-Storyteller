// scripts/migrate.js
// Run this with: node scripts/migrate.js
// You need to download your serviceAccountKey.json from Firebase Console:
// Project Settings -> Service Accounts -> Generate new private key

const admin = require('firebase-admin');
const Database = require('better-sqlite3');
const path = require('path');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const sqlite = new Database(path.join(__dirname, '../server/eco_pilot.db'));

async function migrate() {
  console.log('🚀 Starting migration...');

  // 1. Migrate Users
  const users = sqlite.prepare('SELECT * FROM users').all();
  for (const u of users) {
    const { id, password, ...data } = u;
    // Note: We use username as document ID for simplicity in this pilot
    await db.collection('users').doc(u.username).set({
      ...data,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Migrated user: ${u.username}`);
  }

  // 2. Migrate Teams
  const teams = sqlite.prepare('SELECT * FROM teams').all();
  for (const t of teams) {
    const { id, ...data } = t;
    await db.collection('teams').doc(id.toString()).set({
      ...data,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Migrated team: ${t.name}`);
  }

  // 3. Migrate Rubrics
  const rubrics = sqlite.prepare('SELECT * FROM rubrics').all();
  for (const r of rubrics) {
    const { id, levels, ...data } = r;
    await db.collection('rubrics').doc(id.toString()).set({
      ...data,
      levels: JSON.parse(levels)
    });
    console.log(`✅ Migrated rubric: ${r.name}`);
  }

  // 4. Migrate Submissions
  const subs = sqlite.prepare('SELECT * FROM submissions').all();
  for (const s of subs) {
    const { id, team_id, ...data } = s;
    await db.collection('submissions').doc(`${team_id}_${s.step}`).set({
      ...data,
      team_id: team_id.toString(),
      submitted_at: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  console.log('🎉 Migration complete!');
  process.exit(0);
}

migrate().catch(console.error);
