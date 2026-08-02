// seed-subjects-full.mjs — ปวส.2567 สาขาเทคโนโลยีธุรกิจดิจิทัล
// ดึงมาจาก: 31910v4.pdf (หลักสูตร) + 30000v6.pdf (สมรรถนะแกนกลาง)
//
// Run: node seed-subjects-full.mjs admin A123b456
// (ใส่ username หรือ email ก็ได้ — ถ้าไม่มี @ จะเติม @eco.com ให้อัตโนมัติ)

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

// =====================================================================
// ข้อมูลรายวิชา ปวส.2567 — ครบทุกหมวด
// category    : ปรับพื้นฐาน | สามัญ | พื้นฐานวิชาชีพ | วิชาชีพ | กิจกรรม
// competencyGroup : กลุ่มสมรรถนะย่อย
// =====================================================================
const SUBJECTS = [

  // ── รายวิชาปรับพื้นฐานวิชาชีพ ─────────────────────────────────────
  { code:"31910-0001", name:"ระบบปฏิบัติการและบำรุงรักษาคอมพิวเตอร์",    nameEn:"Operating System and Computer Maintenance",   credits:"2-2-3", category:"ปรับพื้นฐาน", competencyGroup:"วิชาชีพ" },
  { code:"31910-0002", name:"องค์ประกอบศิลป์สำหรับงานกราฟิก",            nameEn:"Art-Elements for Graphic",                    credits:"2-2-3", category:"ปรับพื้นฐาน", competencyGroup:"วิชาชีพ" },
  { code:"31910-0003", name:"การสร้างเว็บไซต์",                           nameEn:"Creating Website",                            credits:"2-2-3", category:"ปรับพื้นฐาน", competencyGroup:"วิชาชีพ" },
  { code:"31910-0004", name:"การเขียนโปรแกรมคอมพิวเตอร์",                nameEn:"Computer Programming",                        credits:"2-2-3", category:"ปรับพื้นฐาน", competencyGroup:"วิชาชีพ" },
  { code:"31910-0005", name:"ระบบเครือข่ายคอมพิวเตอร์เบื้องต้น",         nameEn:"Basic Computer Networking",                   credits:"2-2-3", category:"ปรับพื้นฐาน", competencyGroup:"วิชาชีพ" },

  // ── หมวดวิชาสมรรถนะแกนกลาง — ภาษาและการสื่อสาร ────────────────────
  { code:"30000-1101", name:"ทักษะภาษาไทยเพื่อการสื่อสารในงานอาชีพ",     nameEn:"Thai Language Skills for Career Communication",           credits:"1-2-2", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1102", name:"ทักษะการเขียนและการพูดภาษาไทยในงานอาชีพ",   nameEn:"Occupational Thai Writing and Speaking Skills",           credits:"1-2-2", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1103", name:"ทักษะภาษาไทยเพื่อการนำเสนอเชิงวิชาชีพ",    nameEn:"Thai for Occupational Presentation",                      credits:"1-2-2", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1104", name:"ทักษะภาษาไทยเชิงสร้างสรรค์",               nameEn:"Creative Thai Language Skills",                          credits:"1-2-2", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1201", name:"ภาษาอังกฤษสำหรับงานอาชีพ",                  nameEn:"English for Career",                                     credits:"1-2-2", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1202", name:"การเขียนและการนำเสนอโครงงานภาษาอังกฤษ",     nameEn:"Writing and Presenting English Project Work",             credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1206", name:"ภาษาอังกฤษสำหรับเทคโนโลยีธุรกิจดิจิทัล",   nameEn:"English for Digital Business Technology",                credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1212", name:"ภาษาอังกฤษสำหรับงานอุตสาหกรรมดิจิทัลและเทคโนโลยีสารสนเทศ", nameEn:"English for Digital Information Technology Industry", credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1220", name:"ภาษาและวัฒนธรรมจีน",                        nameEn:"Chinese Language and Culture",                           credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1221", name:"การสนทนาภาษาจีนสำหรับการทำงาน",             nameEn:"Chinese Conversation for Work",                          credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1225", name:"ภาษาและวัฒนธรรมญี่ปุ่น",                   nameEn:"Japanese Language and Culture",                          credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },
  { code:"30000-1227", name:"ภาษาและวัฒนธรรมเกาหลี",                    nameEn:"Korean Language and Culture",                            credits:"0-2-1", category:"สามัญ", competencyGroup:"ภาษาและการสื่อสาร" },

  // ── หมวดวิชาสมรรถนะแกนกลาง — การคิดและการแก้ปัญหา ─────────────────
  { code:"30000-1301", name:"วิทยาศาสตร์งานอาชีพธุรกิจและบริการ",        nameEn:"Science for Business and Services Careers",              credits:"2-2-3", category:"สามัญ", competencyGroup:"การคิดและการแก้ปัญหา" },
  { code:"30000-1401", name:"คณิตศาสตร์และสถิติเพื่องานอาชีพ",           nameEn:"Mathematics and Statistics for Careers",                 credits:"3-0-3", category:"สามัญ", competencyGroup:"การคิดและการแก้ปัญหา" },
  { code:"30000-1402", name:"คณิตศาสตร์เพื่อพัฒนาทักษะการคิด",          nameEn:"Mathematics for Thinking Skills Development",            credits:"3-0-3", category:"สามัญ", competencyGroup:"การคิดและการแก้ปัญหา" },
  { code:"30000-1404", name:"แคลคูลัส 1",                               nameEn:"Calculus 1",                                             credits:"3-0-3", category:"สามัญ", competencyGroup:"การคิดและการแก้ปัญหา" },
  { code:"30000-1408", name:"คณิตศาสตร์ธุรกิจและบริการ",                 nameEn:"Mathematics for Business and Service",                   credits:"3-0-3", category:"สามัญ", competencyGroup:"การคิดและการแก้ปัญหา" },

  // ── หมวดวิชาสมรรถนะแกนกลาง — สังคมและการดำรงชีวิต ─────────────────
  { code:"30000-1501", name:"สังคมไทยในยุคดิจิทัล",                      nameEn:"Thai Society in the Digital Era",                        credits:"1-2-2", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1502", name:"การพัฒนาท้องถิ่น",                          nameEn:"Local Development",                                      credits:"1-2-2", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1503", name:"หลักปรัชญาของเศรษฐกิจพอเพียงเพื่อการดำเนินชีวิต", nameEn:"Sufficiency Economic Philosophy for Life Style",    credits:"1-0-1", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1601", name:"การพัฒนาสุขภาพ",                            nameEn:"Health Improvement",                                     credits:"2-0-2", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1602", name:"ทักษะแห่งความสุข",                          nameEn:"Happiness Skill",                                        credits:"2-0-2", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1605", name:"การจัดการกีฬาและการออกกำลังกายเพื่ออาชีพ",  nameEn:"Sport Management and Exercise for Career",               credits:"0-2-1", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },
  { code:"30000-1606", name:"ภาวะผู้นำและการทำงานเป็นทีม",               nameEn:"Leadership and Teamwork",                                credits:"2-0-2", category:"สามัญ", competencyGroup:"สังคมและการดำรงชีวิต" },

  // ── หมวดวิชาสมรรถนะวิชาชีพ — วิชาชีพพื้นฐาน (30001) ──────────────
  { code:"30001-1001", name:"การเป็นผู้ประกอบการ",                        nameEn:"Entrepreneurship",                                       credits:"2-2-3", category:"พื้นฐานวิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },
  { code:"30001-1002", name:"องค์การและการบริหารงานคุณภาพ",               nameEn:"Organization and Quality Administration",                credits:"3-0-3", category:"พื้นฐานวิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },
  { code:"30001-1003", name:"การประยุกต์ใช้เทคโนโลยีดิจิทัลในอาชีพ",     nameEn:"Application of Digital Literacy for Career",             credits:"2-2-3", category:"พื้นฐานวิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },

  // ── หมวดวิชาสมรรถนะวิชาชีพ — วิชาชีพพื้นฐาน (31910-1xxx) ─────────
  { code:"31910-1001", name:"กฎหมายในงานธุรกิจดิจิทัลและพาณิชย์อิเล็กทรอนิกส์", nameEn:"Law for e-Commerce and Digital Business",       credits:"1-0-1", category:"วิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },
  { code:"31910-1002", name:"ธุรกิจดิจิทัล",                             nameEn:"Digital Business",                                       credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },
  { code:"31910-1003", name:"การวิเคราะห์ข้อมูล",                        nameEn:"Data Analytics",                                         credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพพื้นฐาน" },

  // ── หมวดวิชาสมรรถนะวิชาชีพ — วิชาชีพเฉพาะ (31910-2xxx) ────────────
  { code:"31910-2001", name:"การบริหารจัดการความต้องการทางธุรกิจ",        nameEn:"Requirement Management",                                 credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2002", name:"ระบบจัดการฐานข้อมูล",                       nameEn:"Database Management System",                             credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2003", name:"วิเคราะห์และออกแบบระบบเชิงวัตถุ",           nameEn:"Object Oriented Analysis and Design",                    credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2004", name:"หลักการคิดเชิงออกแบบและนวัตกรรมธุรกิจดิจิทัล", nameEn:"Design Thinking and Digital Business Innovation",    credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2005", name:"การเขียนโปรแกรมเชิงวัตถุ",                  nameEn:"Object-Oriented Programming",                            credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2006", name:"การสร้างแบรนด์ธุรกิจดิจิทัล",              nameEn:"Digital Business Branding",                              credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2007", name:"เครือข่ายคอมพิวเตอร์และความปลอดภัย",        nameEn:"Computer Network and Security",                          credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2008", name:"การประยุกต์ AI สำหรับงานธุรกิจ",            nameEn:"AI for Business",                                        credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2009", name:"ธุรกิจดิจิทัลผ่านสื่อสังคมออนไลน์",         nameEn:"Social Media for Digital Business",                      credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2010", name:"สื่อสร้างสรรค์ธุรกิจดิจิทัล",              nameEn:"Creative Media for Digital Business",                    credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2011", name:"การพัฒนาเว็บไซต์ทางธุรกิจ",                nameEn:"Website Development in Business",                        credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2012", name:"อินเทอร์เน็ตเพื่อสรรพสิ่ง",                nameEn:"Internet of Things",                                     credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2013", name:"การประมวลผลแบบคลาวด์",                      nameEn:"Cloud Computing",                                        credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2014", name:"การจัดการประชาสัมพันธ์สื่อดิจิทัล",         nameEn:"Digital Public Relation Management",                     credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2015", name:"การออกแบบสื่อดิจิทัล",                      nameEn:"Digital Media Design",                                   credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2016", name:"โปรแกรมกราฟิกสำหรับผลิตสื่อดิจิทัล",       nameEn:"Graphic for Digital Media Production",                   credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2017", name:"เทคโนโลยีความจริงเสริม",                    nameEn:"Augmented Reality",                                      credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2018", name:"การผลิตสื่อมัลติมีเดียสำหรับธุรกิจดิจิทัล", nameEn:"Multimedia Production for Digital Business",            credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2019", name:"การออกแบบคาแรคเตอร์",                       nameEn:"Character Design",                                       credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2020", name:"การจัดการเนื้อหาสำหรับธุรกิจดิจิทัล",       nameEn:"Content Management for Digital Business",                credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2021", name:"การออกแบบส่วนติดต่อผู้ใช้บนอุปกรณ์พกพา",   nameEn:"User Interface Design on Mobile",                        credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2022", name:"การพัฒนาโปรแกรมบนอุปกรณ์เคลื่อนที่แบบพกพา", nameEn:"Development of Mobile Application",                    credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2023", name:"การบำรุงรักษาคอมพิวเตอร์และอุปกรณ์พกพา",   nameEn:"Maintenance of Computers and Portable Devices",          credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2024", name:"การทดสอบซอฟต์แวร์",                         nameEn:"Software Testing",                                       credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2025", name:"การออกแบบส่วนติดต่อผู้ใช้",                 nameEn:"User Interface Design",                                  credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2026", name:"โปรแกรมกราฟิกสำหรับการออกแบบเว็บไซต์",      nameEn:"Computer Graphics for Web Design",                       credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2027", name:"การพัฒนาระบบพาณิชย์อิเล็กทรอนิกส์",        nameEn:"E-Commerce System Development",                          credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2028", name:"การพาณิชย์บนสื่อสังคมออนไลน์",              nameEn:"Social Media for Commerce",                              credits:"2-2-3", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2029", name:"โครงงานด้านเทคโนโลยีธุรกิจดิจิทัล",         nameEn:"Digital Business Technology Project",                    credits:"0-12-4", category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2030", name:"โครงงานด้านเทคโนโลยีธุรกิจดิจิทัล 1",       nameEn:"Digital Business Technology Project 1",                  credits:"0-6-2",  category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },
  { code:"31910-2031", name:"โครงงานด้านเทคโนโลยีธุรกิจดิจิทัล 2",       nameEn:"Digital Business Technology Project 2",                  credits:"0-6-2",  category:"วิชาชีพ", competencyGroup:"วิชาชีพเฉพาะ" },

  // ── กิจกรรมเสริมหลักสูตร ─────────────────────────────────────────
  { code:"30000-2001", name:"กิจกรรมเสริมสร้างสุจริต จิตอาสา",           nameEn:"Strengthen Honesty and Volunteerism",                    credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2002", name:"กิจกรรมองค์การวิชาชีพ 1",                  nameEn:"Vocational Organization Activity 1",                     credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2003", name:"กิจกรรมองค์การวิชาชีพ 2",                  nameEn:"Vocational Organization Activity 2",                     credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2004", name:"กิจกรรมองค์การวิชาชีพ 3",                  nameEn:"Vocational Organization Activity 3",                     credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2005", name:"กิจกรรมในสถานประกอบการ 1",                  nameEn:"Workplace Activity 1",                                   credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2006", name:"กิจกรรมในสถานประกอบการ 2",                  nameEn:"Workplace Activity 2",                                   credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2007", name:"กิจกรรมในสถานประกอบการ 3",                  nameEn:"Workplace Activity 3",                                   credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2008", name:"กิจกรรมเสริมสร้างผู้เรียนตามอัธยาศัย 1",   nameEn:"Recreational Activity for Learners Development 1",       credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2009", name:"กิจกรรมเสริมสร้างผู้เรียนตามอัธยาศัย 2",   nameEn:"Recreational Activity for Learners Development 2",       credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2010", name:"กิจกรรมเสริมสร้างผู้เรียนตามอัธยาศัย 3",   nameEn:"Recreational Activity for Learners Development 3",       credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
  { code:"30000-2011", name:"กิจกรรมอาชีวะยุคใหม่ ใส่ใจภัยพิบัติ",       nameEn:"Reskill for Rescue",                                     credits:"0-2-0", category:"กิจกรรม", competencyGroup:"กิจกรรมเสริมหลักสูตร" },
];

// =====================================================================
// Auth & Firestore
// =====================================================================
const [userArg, passArg] = process.argv.slice(2);
if (!userArg || !passArg) {
  console.error('Usage: node seed-subjects-full.mjs <username> <password>');
  process.exit(1);
}
const email = userArg.includes('@') ? userArg : `${userArg}@eco.com`;

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

console.log(`\n🔐 กำลัง Login ด้วย ${email} ...`);
await signInWithEmailAndPassword(auth, email, passArg);
console.log('✅ Login สำเร็จ\n');

// Summary before import
const byCat = {};
for (const s of SUBJECTS) {
  byCat[s.category] = (byCat[s.category] || 0) + 1;
}
console.log(`📚 รายวิชาทั้งหมด ${SUBJECTS.length} รายวิชา`);
for (const [cat, n] of Object.entries(byCat)) {
  console.log(`   ${cat}: ${n} วิชา`);
}
console.log('');

let ok = 0, fail = 0;
for (const s of SUBJECTS) {
  try {
    await setDoc(doc(db, 'subjects', s.code), {
      code:           s.code,
      name:           s.name,
      nameEn:         s.nameEn   || '',
      credits:        s.credits  || '',
      category:       s.category,         // ปรับพื้นฐาน | สามัญ | พื้นฐานวิชาชีพ | วิชาชีพ | กิจกรรม
      competencyGroup: s.competencyGroup, // กลุ่มสมรรถนะย่อย
      semester:       '',                  // ใส่ทีหลังได้ใน app
      standardRef:    '',
      learningOutcome: '',
      objectives:     '',
      competencies:   '',
      description:    '',
      created_at:     new Date().toISOString(),
    });
    console.log(`  ✅ ${s.code}  ${s.name}`);
    ok++;
  } catch (err) {
    console.error(`  ❌ ${s.code}  ${err.message}`);
    fail++;
  }
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`นำเข้าสำเร็จ ${ok} รายวิชา  |  ผิดพลาด ${fail} รายวิชา`);
process.exit(fail > 0 ? 1 : 0);
