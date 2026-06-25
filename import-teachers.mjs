// ─────────────────────────────────────────────────────────────────────────────
// import-teachers.mjs
// รันด้วย:  node import-teachers.mjs
// สร้างบัญชีอาจารย์ 8 คน เข้า Firebase
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyD-6MoGomSd56NZfCA9akhxJOBgSI9Smi4',
  authDomain:        'ai-storyteller-9dc3a.firebaseapp.com',
  projectId:         'ai-storyteller-9dc3a',
  storageBucket:     'ai-storyteller-9dc3a.firebasestorage.app',
  messagingSenderId: '141430153134',
  appId:             '1:141430153134:web:b71b6626da17c6d1b9723f',
};

// ── รายชื่ออาจารย์ ────────────────────────────────────────────────────────────
const TEACHERS = [
  { name: 'อาจารย์ณัฏฐนันท์ นวลประสิทธิ์กุล', nameEn: 'Miss Nattanan Nuanprasitkun',    username: 'nattanan'  },
  { name: 'อาจารย์กฤษฎา ทองกำเหนิด',           nameEn: 'Miss Kritsada Thongkamnerd',     username: 'kritsada'  },
  { name: 'อาจารย์ฐิติรัตน์ ชาติไทยเจริญ',      nameEn: 'Miss Thitirat Chatthaicharoen',  username: 'thitirat'  },
  { name: 'อาจารย์เจนจบ มาเพ็ชร์',              nameEn: 'Mr. Chenjop Mapech',             username: 'chenjop'   },
  { name: 'อาจารย์สุธาทิพย์ พลตรี',             nameEn: 'Miss Suthathip Poltree',         username: 'suthathip' },
  { name: 'อาจารย์บรรพต นิลพาณิชย์',            nameEn: 'Mr. Banphot Ninpanit',           username: 'banphot'   },
  { name: 'อาจารย์วิไลวรรณ นวลละออง',           nameEn: 'Miss Wilaiwan Nuanla-ong',       username: 'wilaiwan'  },
  { name: 'อาจารย์สุมาลี ยืนยงนาวิน',           nameEn: 'Miss Sumalee Yuenyongnawin',     username: 'sumalee'   },
];

const ADMIN_EMAIL      = 'admin@eco.com';
const ADMIN_PASSWORD   = 'admin123';
const DEFAULT_PASSWORD = 'teacher123';

async function createTeacher(db, auth2, t, idx) {
  const email    = `${t.username}@eco.com`;
  const password = DEFAULT_PASSWORD;

  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(auth2, email, password);
    uid = cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`  ⏭  ข้าม ${t.username} (มีบัญชีแล้ว)`);
      return { ok: false, reason: 'already-exists' };
    }
    throw err;
  }

  await setDoc(doc(db, 'users', uid), {
    username:   t.username,
    name:       t.name,
    name_en:    t.nameEn,
    role:       'teacher',
    team_id:    null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  console.log(`  ✅ [${String(idx + 1).padStart(2, '0')}] ${t.name.padEnd(30)} → ${t.username}`);
  return { ok: true, uid };
}

async function main() {
  console.log('🚀 เริ่มนำเข้าอาจารย์ (8 คน)\n');

  const primary   = getApps().length ? getApp() : initializeApp(firebaseConfig, 'primary');
  const db        = getFirestore(primary);
  const authP     = getAuth(primary);
  const secondary = initializeApp(firebaseConfig, 'secondary-import');
  const auth2     = getAuth(secondary);

  console.log('🔐 Sign in admin...');
  await signInWithEmailAndPassword(authP, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ signed in\n');

  let created = 0, skipped = 0, failed = 0;

  for (let i = 0; i < TEACHERS.length; i++) {
    const t = TEACHERS[i];
    try {
      const result = await createTeacher(db, auth2, t, i);
      if (result.ok) created++;
      else skipped++;
    } catch (err) {
      console.error(`  ❌ ${t.name}: ${err.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ สร้างสำเร็จ : ${created} คน`);
  if (skipped) console.log(`⏭  ข้ามแล้ว   : ${skipped} คน (มีบัญชีอยู่แล้ว)`);
  if (failed)  console.log(`❌ ล้มเหลว    : ${failed} คน`);
  console.log(`\nUsername = ชื่อภาษาอังกฤษ (ดูตาราง)`);
  console.log(`Password = ${DEFAULT_PASSWORD} (ทุกคน)`);
  process.exit(0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
