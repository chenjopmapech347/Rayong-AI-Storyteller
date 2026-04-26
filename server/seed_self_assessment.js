import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'eco_pilot.db');

const db = new Database(DB_PATH);

// 1. Add category column if it doesn't exist
try {
    db.exec("ALTER TABLE rubrics ADD COLUMN category TEXT DEFAULT 'เกณฑ์การประเมิน Pitching'");
    console.log('✅ Added category column to rubrics table');
} catch (e) {
    console.log('ℹ️ Category column already exists or error:', e.message);
}

// 2. Read the Self-Assessment CSV
const csvPath = 'c:\\Users\\Shifuu\\Desktop\\แบบบันทึกการประเมินตนเอง (Student Self-Assessment).csv';
const csvData = fs.readFileSync(csvPath, 'utf8');

// Parse CSV (handling quoted strings if any, though splitting by comma might break if quotes contain commas)
// Let's use a simple regex for CSV splitting that handles quotes
function splitCsv(text) {
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\s\S][^'\\]*)*)'|"([^"\\]*(?:\\[\s\S][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    let a = [];
    text.replace(re_value, function(m0, m1, m2, m3) {
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return '';
    });
    // Handle empty last value if string ends with comma
    if (/,\s*$/.test(text)) a.push('');
    return a;
}

const lines = csvData.split('\n').filter(l => l.trim() !== '');
const rubrics = [];

lines.forEach((line, index) => {
    if (index === 0) return; // Skip header
    const cols = splitCsv(line);
    const name = cols[0];
    const levels = cols.slice(1);
    
    // Reverse levels from [4, 3, 2, 1] to [1, 2, 3, 4] for left-to-right display
    const reversedLevels = [...levels].reverse();
    rubrics.push({ name, levels: reversedLevels });
});

// Insert new rubrics
const insert = db.prepare('INSERT INTO rubrics (name, max, levels, category) VALUES (?, ?, ?, ?)');
const insertMany = db.transaction(() => {
    rubrics.forEach(r => {
        insert.run(r.name, 4, JSON.stringify(r.levels), 'แบบประเมินผลการเรียนรู้ของตนเอง');
    });
});

insertMany();

console.log(`✅ Successfully imported ${rubrics.length} Self-Assessment rubrics into the database.`);
