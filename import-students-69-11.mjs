// ─────────────────────────────────────────────────────────────────────────────
// import-students-69-11.mjs
// รันด้วย:  node import-students-69-11.mjs
// สร้างบัญชีนักเรียน ห้อง สทธ.69-11 จำนวน 24 คน เข้า Firebase
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps, getApp, initializeApp as initSecondary } from 'firebase/app';
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

// ── รายชื่อนักเรียน ห้อง สทธ.69-11 ─────────────────────────────────────────
const STUDENTS = [
  { name: 'ศิริญา นาคสมบูรณ์',        code: '6932040001', nickname: 'การ์ฟิลด์' },
  { name: 'ธนากร บัวติ๊บ',             code: '6932040002', nickname: 'โด่ง'      },
  { name: 'ดานิโล อโนทัย เดนตี้',      code: '6932040003', nickname: 'โตโล่'     },
  { name: 'พิชญา ประทุมเพ็ชร',         code: '6932040006', nickname: 'มิว'       },
  { name: 'วันสุ นิ่มประเสริฐ',         code: '6932040007', nickname: ''          },
  { name: 'วรชิต เขียวหวาน',           code: '6932040008', nickname: 'ฟาร์ม'     },
  { name: 'ปวเรศ จำพานิชย์',           code: '6932040009', nickname: 'คิง'       },
  { name: 'เสฎฐวุฒิ แสนบุญมี',         code: '6932040010', nickname: 'เจมส์'     },
  { name: 'ปวีณ์นุช บินหะยีอาระซัน',   code: '6932040011', nickname: 'อัลนูร'    },
  { name: 'ฟ่ะฮัด ชัยพฤกษ์',           code: '6932040012', nickname: 'ฟาฮัด'     },
  { name: 'ปฏิวิทย์ แซ่ลิ่ม',          code: '6932040013', nickname: ''          },
  { name: 'ถิระศักดิ์ ไสยกิจ',          code: '6932040015', nickname: 'โบ๊ท'      },
  { name: 'กนกวรรณ สุภาพ',             code: '6932040016', nickname: 'หยก'       },
  { name: 'ประวีณ ผลถวิล',             code: '6932040017', nickname: 'เหนือ'     },
  { name: 'กัญญาวีร์ พิทักษ์ลักษณ์',   code: '6932040018', nickname: 'ฮาบี'      },
  { name: 'เคอหนุ่ม',                   code: '6932040020', nickname: ''          },
  { name: 'ทิราภรณ์ ทองเกษมศรี',       code: '6932040021', nickname: 'บิว'       },
  { name: 'ธนัชชา จุ้ยรอด',            code: '6932040022', nickname: 'ออมสิน'    },
  { name: 'สุภัสสรา บุญแต่ง',           code: '6932040023', nickname: 'รถแจ๊ส'    },
  { name: 'ธัญกมล เพ็ชรธนดำรง',        code: '6932040024', nickname: 'เอด้า'     },
  { name: 'สุจิรา วงศ์เกิดสุข',         code: '6932040025', nickname: 'น้ำปั่น'   },
  { name: 'ตรีรัตน์ ศรีภุมมา',          code: '6932040026', nickname: 'นัท'       },
  { name: 'วัชรวิศว์ เปล่งปลั่ง',       code: '6932040027', nickname: 'เฟส'       },
  { name: 'วารีรัตน์ อังครุฑ',          code: '6932040028', nickname: 'ฟิว'       },
];

const ADMIN_EMAIL    = 'admin@eco.com';
const ADMIN_PASSWORD = 'admin123';
const DEFAULT_PASSWORD = 'student123';

// ── helpers ──────────────────────────────────────────────────────────────────
function safeDocId(str) {
  return str.replace(/[/\\.#$[\]]/g, '_');
}

async function createStudent(db, auth2, s, idx) {
  const username = s.code;
  const email    = `${username}@eco.com`;
  const password = DEFAULT_PASSWORD;

  // 1. สร้าง Auth account บน secondary app
  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(auth2, email, password);
    uid = cred.user.uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`  ⏭  ข้าม ${username} (มีบัญชีแล้ว)`);
      return { ok: false, reason: 'already-exists' };
    }
    throw err;
  }

  // 2. สร้าง Firestore doc
  await setDoc(doc(db, 'users', uid), {
    username,
    name:       s.name,
    nickname:   s.nickname || '',
    role:       'student',
    team_id:    null,
    classroom:  'สทธ.69-11',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  console.log(`  ✅ [${String(idx+1).padStart(2,'0')}] ${s.name.padEnd(28)} → ${username}`);
  return { ok: true, uid };
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 เริ่มนำเข้ารายชื่อนักเรียน ห้อง สทธ.69-11 (24 คน)\n');

  // Primary app — สำหรับ sign-in admin + Firestore
  const primary = getApps().length ? getApp() : initializeApp(firebaseConfig, 'primary');
  const db      = getFirestore(primary);
  const authP   = getAuth(primary);

  // Secondary app — สำหรับสร้าง Auth accounts ไม่ kick admin ออก
  const secondary = initializeApp(firebaseConfig, 'secondary-import');
  const auth2     = getAuth(secondary);

  // Sign in admin เพื่อให้ Firestore rules ผ่าน
  console.log('🔐 Sign in admin...');
  await signInWithEmailAndPassword(authP, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ signed in\n');

  let created = 0, skipped = 0, failed = 0;

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    try {
      const result = await createStudent(db, auth2, s, i);
      if (result.ok) created++;
      else skipped++;
    } catch (err) {
      console.error(`  ❌ ${s.name}: ${err.message}`);
      failed++;
    }
    // ป้องกัน rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ สร้างสำเร็จ : ${created} คน`);
  if (skipped) console.log(`⏭  ข้ามแล้ว   : ${skipped} คน (มีบัญชีอยู่แล้ว)`);
  if (failed)  console.log(`❌ ล้มเหลว    : ${failed} คน`);
  console.log(`\nUsername = รหัสนักศึกษา (6932040xxx)`);
  console.log(`Password = ${DEFAULT_PASSWORD} (ทุกคน)`);
  console.log(`\n💡 ไปกำหนดทีมได้ที่ Admin → Users ในเว็บ`);
  process.exit(0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
