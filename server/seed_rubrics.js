import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'eco_pilot.db');

const db = new Database(DB_PATH);

// Read the CSV file
const csvPath = 'c:\\Users\\Shifuu\\Desktop\\แบบประเมินผลการเรียนรู้ Green Rayong 4-Identities AI.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');
const lines = csvData.split('\n').filter(l => l.trim() !== '');

const rubrics = [];

let rubric1Name = '';
let rubric1Levels = [];

lines.forEach((line, index) => {
    // Basic CSV split by comma (assuming no commas inside quotes in this specific file based on preview)
    // Actually, looking at the preview, there are no quotes used for escaping commas.
    const cols = line.split(',');
    
    if (index === 0) {
        rubric1Name = cols[0];
    } else if (index === 1) {
        rubric1Levels = cols.slice(1);
        rubrics.push({ name: rubric1Name, levels: rubric1Levels });
    } else {
        const name = cols[0];
        const levels = cols.slice(1);
        rubrics.push({ name, levels });
    }
});

// Clear existing rubrics
db.prepare('DELETE FROM rubrics').run();

// Insert new rubrics
const insert = db.prepare('INSERT INTO rubrics (name, max, levels) VALUES (?, ?, ?)');
const insertMany = db.transaction(() => {
    rubrics.forEach(r => {
        // levels in the CSV are from 4 to 1.
        // We should reverse them to be 1 to 4 if we want, or keep them as is.
        // The frontend expects array index 0 to be level 1 based on my UI `ระดับที่ {idx + 1}`.
        // The CSV is: [4, 3, 2, 1]
        // Let's reverse them so it displays left-to-right as Level 1 to 4.
        const reversedLevels = [...r.levels].reverse();
        insert.run(r.name, 4, JSON.stringify(reversedLevels));
    });
});

insertMany();

console.log(`✅ Successfully imported ${rubrics.length} rubrics into the database.`);
