/**
 * seed-subjects.mjs
 * เพิ่มรายวิชา 31910-2002, 31910-2004, 31910-2013 เข้า Firestore
 *
 * วิธีใช้:
 *   node scripts/seed-subjects.mjs  อีเมล  รหัสผ่าน
 *
 * ตัวอย่าง:
 *   node scripts/seed-subjects.mjs admin@school.ac.th mypassword
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node scripts/seed-subjects.mjs <email> <password>');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: "AIzaSyD-6MoGomSd56NZfCA9akhxJOBgSI9Smi4",
  authDomain: "ai-storyteller-9dc3a.firebaseapp.com",
  projectId: "ai-storyteller-9dc3a",
  storageBucket: "ai-storyteller-9dc3a.firebasestorage.app",
  messagingSenderId: "141430153134",
  appId: "1:141430153134:web:b71b6626da17c6d1b9723f",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const subjects = [
  {
    id: '31910-2002',
    code: '31910-2002',
    name: 'ระบบการจัดการฐานข้อมูล',
    credits: '2-2-3',
    standardRef: 'รหัส 12305 อาชีพนักพัฒนาซอฟต์แวร์ด้านอุปกรณ์เคลื่อนที่ ระดับ 4; รหัส 3012 อาชีพนักพัฒนาและบริหารข้อมูลระบบเว็บไซต์ด้านพาณิชย์อิเล็กทรอนิกส์ ระดับ 5',
    learningOutcome: 'ออกแบบฐานข้อมูล แบบจำลองเอนทิตี้และความสัมพันธ์ รูปแบบบรรทัดฐาน ออกแบบฐานข้อมูลเชิงสัมพันธ์ตามหลักการ ด้วยความละเอียด รอบคอบ',
    objectives: '1. เข้าใจแนวคิดและการออกแบบระบบจัดการฐานข้อมูล\n2. มีทักษะในการออกแบบระบบจัดการฐานข้อมูล\n3. มีความสามารถประยุกต์ใช้ระบบจัดการฐานข้อมูลสำหรับงานธุรกิจดิจิทัล\n4. มีเจตคติและกิจนิสัยที่ดีในการปฏิบัติงานด้วยความรับผิดชอบ ซื่อสัตย์ ละเอียด รอบคอบ',
    competencies: '1. ประมวลความรู้เกี่ยวกับการออกแบบฐานข้อมูลตามหลักการ\n2. ออกแบบฐานข้อมูลสำหรับงานธุรกิจตามหลักการ\n3. ประยุกต์ใช้ระบบจัดการฐานข้อมูลในงานธุรกิจดิจิทัล',
    description: 'ศึกษาและปฏิบัติเกี่ยวกับหลักการของระบบฐานข้อมูล ขั้นตอนการพัฒนาระบบฐานข้อมูล สถาปัตยกรรมฐานข้อมูล แบบจำลองข้อมูล การวิเคราะห์และการออกแบบฐานข้อมูล แบบจำลองเอนทิตี้และความสัมพันธ์ รูปแบบบรรทัดฐาน การออกแบบฐานข้อมูลเชิงสัมพันธ์ ภาษามาตรฐานบนระบบฐานข้อมูล และมีความรู้พื้นฐานเกี่ยวกับฐานข้อมูลไม่ใช่เชิงสัมพันธ์ (NoSQL) และระบบฐานข้อมูลบนคลาวด์',
  },
  {
    id: '31910-2004',
    code: '31910-2004',
    name: 'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่',
    credits: '2-2-3',
    standardRef: '',
    learningOutcome: '',
    objectives: '',
    competencies: '',
    description: '',
  },
  {
    id: '31910-2013',
    code: '31910-2013',
    name: 'โครงงานพัฒนาระบบธุรกิจดิจิทัล',
    credits: '0-6-2',
    standardRef: '',
    learningOutcome: '',
    objectives: '',
    competencies: '',
    description: '',
  },
];

async function seedSubjects() {
  console.log(`🔐 กำลัง sign in ด้วย ${email} ...`);
  await signInWithEmailAndPassword(auth, email, password);
  console.log('✅ Sign in สำเร็จ\n');

  for (const subject of subjects) {
    const { id, ...data } = subject;
    await setDoc(doc(db, 'subjects', id), { ...data, created_at: new Date().toISOString() }, { merge: true });
    console.log(`✅ upserted: ${id} — ${data.name}`);
  }

  console.log('\n🎉 Done! ตรวจสอบใน Admin → รายวิชา ได้เลย');
  process.exit(0);
}

seedSubjects().catch(err => {
  console.error('❌ Error:', err.message || err);
  process.exit(1);
});
