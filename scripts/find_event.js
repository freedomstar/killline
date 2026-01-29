
const fs = require('fs');
const path = 'g:/Project/KL/killzone-survivor/js/events.js';

try {
    const data = fs.readFileSync(path, 'utf8');
    const lines = data.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('rent_due')) {
            console.log(`Found 'rent_due' at line ${i + 1}: ${lines[i].trim()}`);
            found = true;
        }
        if (lines[i].includes('medical_emergency')) {
            console.log(`Found 'medical_emergency' at line ${i + 1}: ${lines[i].trim()}`);
        }
    }
    if (!found) console.log("Not found 'rent_due'");
} catch (err) {
    console.error(err);
}
