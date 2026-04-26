// server/seed_good_prompts.js
// One-shot seeder for the Good Prompt Library.
// Idempotent: skips any prompt whose title already exists.
// Usage:  node server/seed_good_prompts.js

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'eco_pilot.db');

const db = new Database(DB_PATH);

// Make sure the table exists so this script works even if the server has
// never been started after the schema was updated.
db.exec(`
  CREATE TABLE IF NOT EXISTS good_prompts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    category    TEXT NOT NULL DEFAULT 'General',
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

const PROMPTS = [
  {
    title: 'สัมภาษณ์ปราชญ์ชาวบ้าน',
    category: 'Local Wisdom',
    content: 'Act as a respectful field researcher. I am about to interview a local sage from Rayong about [TOPIC]. Generate 10 open-ended interview questions that progress from rapport-building to deeper inquiry. The questions should surface (a) the origin story of the practice, (b) the sage\'s personal craft and lineage, (c) how the practice has evolved with time, (d) cultural significance to the community, and (e) risks of the knowledge being lost. Use polite Thai-context framing. Output as a numbered list.'
  },
  {
    title: 'วิเคราะห์ปัญหาสิ่งแวดล้อม',
    category: 'Environment',
    content: 'You are an environmental analyst working in Rayong province. Given the area [AREA] and the observation [OBSERVATION], produce a structured analysis with: 1) three to five concrete environmental issues, 2) likely root causes for each, 3) affected stakeholders and ecosystems, 4) two evidence-based intervention options per issue (one low-cost, one high-impact), and 5) local cultural or political constraints to consider. State assumptions clearly.'
  },
  {
    title: 'ออกแบบนวัตกรรมจากภูมิปัญญา',
    category: 'Innovation',
    content: 'You are a product designer fusing Thai local wisdom with modern technology. Local wisdom: [WISDOM]. Problem to solve: [PROBLEM]. Target user: [USER]. Propose three distinct prototype concepts. For each, describe: working principle, materials and tools, build steps, estimated cost in THB, and how the local wisdom is genuinely honored (not just decorative). End with a short comparison table and recommend one with reasoning.'
  },
  {
    title: 'สร้าง Business Model Canvas',
    category: 'Business Plan',
    content: 'Act as a business mentor for a student team in Rayong. Their product is [PRODUCT] derived from [LOCAL_INPUT]. Build a complete Business Model Canvas covering all nine blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure. For each block, give two to four bullet points and call out the single riskiest assumption.'
  },
  {
    title: 'สคริปต์วิดีโอ Storytelling 3 นาที',
    category: 'Storytelling',
    content: 'Write a 3-minute (~450 word) narrative video script for the Green Rayong AI Storytellers project about [TOPIC]. Structure: Hook (0:00-0:15) — a striking image or question; Setup (0:15-1:00) — character and conflict; Journey (1:00-2:30) — the discovery and the moment local wisdom meets AI; Resolution + Call-to-Action (2:30-3:00). Include shot directions in [brackets] and on-screen text suggestions. Tone: warm, hopeful, grounded.'
  },
  {
    title: 'ปรับปรุง Prompt ให้คมชัด',
    category: 'AI Prompting',
    content: 'Critique and rewrite the following prompt to be sharper and more reliable: "[ORIGINAL_PROMPT]". Apply the RTCFC pattern — Role, Task, Context, Format, Constraints. Return: 1) the rewritten prompt, 2) a bullet list of every change you made and why, 3) one example of the kind of output the new prompt should produce, and 4) two follow-up prompts a user could chain afterwards.'
  },
  {
    title: 'วิเคราะห์ตลาดและคู่แข่ง',
    category: 'Business Plan',
    content: 'You are a market analyst. For the product [PRODUCT] targeting [SEGMENT] in the Rayong / Eastern Seaboard region, deliver: 1) estimated addressable market size with the assumptions used, 2) three to five direct or adjacent competitors with strengths and weaknesses, 3) a 2x2 positioning map (axes of your choice — justify them), 4) the Unique Selling Proposition our product should claim, and 5) the top three risks with one mitigation each. Be concrete; avoid generic advice.'
  },
  {
    title: 'ประเมิน Carbon Footprint',
    category: 'Environment',
    content: 'Estimate the carbon footprint of the product [PRODUCT] across its lifecycle: raw material sourcing, manufacturing, transport, use, and end-of-life. For each stage state the assumptions, give a kgCO2e estimate with the calculation, and propose one realistic improvement. Conclude with the single largest hotspot and a target percentage reduction. Note any data gaps and what additional information would tighten the estimate.'
  },
  {
    title: 'ตั้งชื่อแบรนด์และสโลแกน',
    category: 'Branding',
    content: 'Generate five brand-name candidates for [PRODUCT_OR_SERVICE] aimed at [TARGET_AUDIENCE]. Each name should evoke the Rayong identity of [IDENTITY: e.g. coastal, agricultural, industrial, creative]. For each candidate provide: the name in Thai and Romanized form, a pronunciation note, a 5-to-7-word slogan in both Thai and English, the emotion it triggers, and one risk (linguistic clash, trademark, etc.). End with your pick and reasoning.'
  },
  {
    title: 'เตรียม Pitch Deck 6 สไลด์',
    category: 'Pitching',
    content: 'Compress the project notes below into a 6-slide pitch deck for a 5-minute student pitch: Slide 1 Problem, Slide 2 Solution and how AI + local wisdom combine, Slide 3 Market and customer evidence, Slide 4 Business model and unit economics, Slide 5 Team, plan, and traction so far, Slide 6 The Ask and call-to-action. For each slide write the headline, three bullets, and one suggested visual. Keep language concrete and metric-driven. Project notes: [NOTES].'
  }
];

const exists = db.prepare('SELECT id FROM good_prompts WHERE title = ?');
const insert = db.prepare(
  'INSERT INTO good_prompts (title, content, category) VALUES (?, ?, ?)'
);

let inserted = 0;
let skipped = 0;

const run = db.transaction(() => {
  for (const p of PROMPTS) {
    if (exists.get(p.title)) {
      console.log(`⏭️  skipped (already exists): ${p.title}`);
      skipped++;
    } else {
      insert.run(p.title, p.content, p.category);
      console.log(`✅ inserted: ${p.title}`);
      inserted++;
    }
  }
});

run();

console.log(`\nDone. Inserted ${inserted}, skipped ${skipped} (of ${PROMPTS.length} total).`);
