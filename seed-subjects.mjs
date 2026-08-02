// seed-subjects.mjs
// Run: node seed-subjects.mjs <admin-email> <password>
// Example: node seed-subjects.mjs admin@eco.com yourpassword
//
// Imports 41 subjects from "รวมรายวิชาทั้งแผนการเรียน" sheet
// into Firestore collection: subjects

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-6MoGomSd56NZfCA9akhxJOBgSI9Smi4",
  authDomain: "ai-storyteller-9dc3a.firebaseapp.com",
  projectId: "ai-storyteller-9dc3a",
  storageBucket: "ai-storyteller-9dc3a.firebasestorage.app",
  messagingSenderId: "141430153134",
  appId: "1:141430153134:web:b71b6626da17c6d1b9723f"
};

const SUBJECTS = [
  {
    "id": "31910-0001",
    "code": "31910-0001",
    "name": "ระบบปฏิบัติการและบำรุงรักษาคอมพิวเตอร์ (B)",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-0003",
    "code": "31910-0003",
    "name": "การสร้างเว็บไซต์ (B)",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "30000-1101",
    "code": "30000-1101",
    "name": "ทักษะภาษาไทยเพื่อการสื่อสารในงานอาชีพ",
    "credits": "2-1-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "30000-1201",
    "code": "30000-1201",
    "name": "ภาษาอังกฤษสำหรับงานอาชีพ",
    "credits": "2-1-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "30000-1301",
    "code": "30000-1301",
    "name": "วิทยาศาสตร์งานอาชีพธุรกิจและบริการ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-2002",
    "code": "31910-2002",
    "name": "ระบบจัดการฐานข้อมูล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-2003",
    "code": "31910-2003",
    "name": "วิเคราะห์และออกแบบระบบเชิงวัตถุ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-2004",
    "code": "31910-2004",
    "name": "หลักการคิดเชิงออกแบบและนวัตกรรมธุรกิจดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-2026",
    "code": "31910-2026",
    "name": "โปรแกรมกราฟิกสำหรับการออกแบบเว็บไซต์",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-2008",
    "code": "31910-2008",
    "name": "การประยุกต์ AI สำหรับงานธุรกิจ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "30000-2001",
    "code": "30000-2001",
    "name": "กิจกรรมเสริมสร้างสุจริต จิตอาสา",
    "credits": "0-0-2",
    "semester": "ภาคเรียนที่ 1 (1/2569)"
  },
  {
    "id": "31910-0002",
    "code": "31910-0002",
    "name": "องค์ประกอบศิลป์สำหรับงานกราฟิก (B)",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "31910-0005",
    "code": "31910-0005",
    "name": "ระบบเครือข่ายคอมพิวเตอร์เบื้องต้น (B)",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30000-1202",
    "code": "30000-1202",
    "name": "การเขียนและการนำเสนอโครงงานภาษาอังกฤษ",
    "credits": "1-0-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30000-1206",
    "code": "30000-1206",
    "name": "ภาษาอังกฤษเทคโนโลยีธุรกิจดิจิทัล",
    "credits": "1-0-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30000-1404",
    "code": "30000-1404",
    "name": "แคลคูลัส 1",
    "credits": "3-3-0",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30000-1601",
    "code": "30000-1601",
    "name": "การพัฒนาสุขภาพ",
    "credits": "2-2-0",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30001-1001",
    "code": "30001-1001",
    "name": "การเป็นผู้ประกอบการ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30001-1003",
    "code": "30001-1003",
    "name": "การประยุกต์ใช้เทคโนโลยีดิจิทัลในอาชีพ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "31910-1003",
    "code": "31910-1003",
    "name": "การวิเคราะห์ข้อมูล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "31910-2018",
    "code": "31910-2018",
    "name": "การผลิตสื่อมัลติมีเดียสำหรับธุรกิจดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "31910-2022",
    "code": "31910-2022",
    "name": "การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่แบบพกพา",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "30000-2002",
    "code": "30000-2002",
    "name": "กิจกรรมองค์การวิชาชีพ 1",
    "credits": "0-0-2",
    "semester": "ภาคเรียนที่ 2 (2/2569)"
  },
  {
    "id": "31910-0004",
    "code": "31910-0004",
    "name": "การเขียนโปรแกรมคอมพิวเตอร์",
    "credits": "3-2-2",
    "semester": "ฤดูร้อน (1/2569)"
  },
  {
    "id": "31910-2012",
    "code": "31910-2012",
    "name": "อินเทอร์เน็ตเพื่อสรรพสิ่ง",
    "credits": "3-2-2",
    "semester": "ฤดูร้อน (1/2569)"
  },
  {
    "id": "31910-2013",
    "code": "31910-2013",
    "name": "การประมวลผลแบบคลาวด์",
    "credits": "3-2-2",
    "semester": "ฤดูร้อน (1/2569)"
  },
  {
    "id": "30000-1503",
    "code": "30000-1503",
    "name": "หลักปรัชญาของเศรษฐกิจพอเพียงเพื่อการดำเนินชีวิต",
    "credits": "1-1-0",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-1002",
    "code": "31910-1002",
    "name": "ธุรกิจดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2005",
    "code": "31910-2005",
    "name": "การเขียนโปรแกรมเชิงวัตถุ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2011",
    "code": "31910-2011",
    "name": "การพัฒนาเว็บไซต์ทางธุรกิจ",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2014",
    "code": "31910-2014",
    "name": "การจัดการประชาสัมพันธ์สื่อดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2015",
    "code": "31910-2015",
    "name": "การออกแบบสื่อดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2024",
    "code": "31910-2024",
    "name": "การทดสอบซอฟต์แวร์",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2027",
    "code": "31910-2027",
    "name": "การพัฒนาระบบพาณิชย์อิเล็กทรอนิกส์",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "31910-2030",
    "code": "31910-2030",
    "name": "โครงงานด้านเทคโนโลยีธุรกิจดิจิทัล 1",
    "credits": "2-0-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "30000-2003",
    "code": "30000-2003",
    "name": "กิจกรรมองค์การวิชาชีพ 2",
    "credits": "0-0-2",
    "semester": "ภาคเรียนที่ 3 (1/2570)"
  },
  {
    "id": "30001-1002",
    "code": "30001-1002",
    "name": "องค์การและการบริหารงานคุณภาพ",
    "credits": "3-3-0",
    "semester": "ภาคเรียนที่ 4 (2/2570)"
  },
  {
    "id": "31910-1001",
    "code": "31910-1001",
    "name": "กฎหมายในงานธุรกิจดิจิทัลและพาณิชย์อิเล็กทรอนิกส์",
    "credits": "1-1-0",
    "semester": "ภาคเรียนที่ 4 (2/2570)"
  },
  {
    "id": "31910-2020",
    "code": "31910-2020",
    "name": "การจัดการเนื้อหาสำหรับธุรกิจดิจิทัล",
    "credits": "3-2-2",
    "semester": "ภาคเรียนที่ 4 (2/2570)"
  },
  {
    "id": "31910-2031",
    "code": "31910-2031",
    "name": "โครงงานด้านเทคโนโลยีธุรกิจดิจิทัล 2",
    "credits": "2-0-2",
    "semester": "ภาคเรียนที่ 4 (2/2570)"
  },
  {
    "id": "30000-2005",
    "code": "30000-2005",
    "name": "กิจกรรมในสถานประกอบการ 1",
    "credits": "0-0-2",
    "semester": "ภาคเรียนที่ 4 (2/2570)"
  }
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const [,, userArg, password] = process.argv;
const email = userArg.includes("@") ? userArg : userArg + "@eco.com";
if (!email || !password) {
  console.error('Usage: node seed-subjects.mjs <email> <password>');
  process.exit(1);
}

async function seed() {
  console.log(`Signing in as ${email}...`);
  await signInWithEmailAndPassword(auth, email, password);
  console.log('Signed in. Importing subjects...');

  let ok = 0, fail = 0;
  for (const s of SUBJECTS) {
    try {
      await setDoc(doc(db, 'subjects', s.id), {
        code: s.code,
        name: s.name,
        credits: s.credits,
        semester: s.semester,
        standardRef: '',
        learningOutcome: '',
        objectives: '',
        competencies: '',
        description: '',
        created_at: new Date().toISOString(),
      });
      console.log(`  ✅ ${s.id}  ${s.name}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${s.id}  ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} imported, ${fail} failed.`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
