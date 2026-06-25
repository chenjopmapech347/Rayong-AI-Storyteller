// ─────────────────────────────────────────────────────────────────────────────
// import-teams.mjs
// รันด้วย:  node import-teams.mjs
// เพิ่ม 6 ทีมเข้า Firebase
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyD-6MoGomSd56NZfCA9akhxJOBgSI9Smi4',
  authDomain:        'ai-storyteller-9dc3a.firebaseapp.com',
  projectId:         'ai-storyteller-9dc3a',
  storageBucket:     'ai-storyteller-9dc3a.firebasestorage.app',
  messagingSenderId: '141430153134',
  appId:             '1:141430153134:web:b71b6626da17c6d1b9723f',
};

const TEAMS = [
  'ราชันมารสวรรค์',
  'ASUS',
  'แกงส้มล้มป่วย',
  'สวนยายเยาว์',
  'ประธานกู้',
  'ประตู 2',
];

const ADMIN_EMAIL    = 'admin@eco.com';
const ADMIN_PASSWORD = 'admin123';

async function main() {
  console.log('🚀 เพิ่มทีม 6 ทีมเข้า Firebase\n');

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig, 'primary');
  const db  = getFirestore(app);
  const auth = getAuth(app);

  console.log('🔐 Sign in admin...');
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ signed in\n');

  let created = 0;
  for (const name of TEAMS) {
    const ref = await addDoc(collection(db, 'teams'), {
      name,
      teacher_id:  null,
      leader_id:   null,
      courseIds:   ['green-rayong'],
      courseId:    'green-rayong',
      created_at:  serverTimestamp(),
    });
    console.log(`  ✅ ${name.padEnd(20)} → id: ${ref.id}`);
    created++;
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ สร้างสำเร็จ : ${created} ทีม`);
  console.log('💡 ไปกำหนดสมาชิก / หัวหน้า ได้ที่ Admin → Management → Teams');
  process.exit(0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
