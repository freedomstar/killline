const fs = require('fs');
const path = require('path');
const I18n = require('./js/i18n.js');

// 1. Flatten I18n definitions to map: key -> expectedArgCount
const definitions = {};

function traverse(obj, prefix = '') {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            traverse(obj[key], prefix ? `${prefix}.${key}` : key);
        } else {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'function') {
                definitions[fullKey] = obj[key].length;
            } else {
                definitions[fullKey] = 0; // Constants expect 0 args
            }
        }
    }
}

// Initialize I18n
if (I18n.texts && I18n.texts.zh) {
    traverse(I18n.texts.zh);
} else {
    console.error('Error: Could not load I18n.texts.zh');
    process.exit(1);
}

// 2. Scan files for I18n.t usage
const filesToScan = [
    'js/events.js',
    'js/ui.js',
    'js/game.js'
];

console.log('--- I18n Call Scanner ---');
console.log('Verifying parameter counts against definitions in js/i18n.js...\n');

let issueCount = 0;

filesToScan.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
        // Simple regex to find I18n.t('key', ...) calls
        // Note: This matches single-line calls best. Multi-line calls might be missed or require smarter parsing.
        const regex = /I18n\.t\(['"]([^'"]+)['"]\s*(?:,\s*(.+?))?\)/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
            const key = match[1];
            const argsStr = match[2];

            // Count arguments passed
            let argCount = 0;
            if (argsStr) {
                // split by comma, handling roughly for nested parens/quotes simply
                // This is a naive count, assuming args don't contain top-level commas inside strings/parens too often in this codebase
                // For robust parsing, we'd need a real parser.
                // But simply checking if argsStr implies presence of arguments is a good start.

                // Better heuristic:
                // 100 -> 1 arg
                // 100, 20 -> 2 args
                argCount = argsStr.split(',').length;
            }

            const expected = definitions[key];

            if (expected === undefined) {
                // Key might be dynamic or just missing, skip dynamic keys usually
                if (!key.includes('${')) { // ignore template literals in key for now
                    // console.warn(`[?] Unknown key in ${file}:${lineIdx + 1}: ${key}`);
                }
            } else {
                // If definition expects args (function) but 0 passed
                if (expected > 0 && argCount === 0) {
                    console.error(`[!] Mismatch in ${file}:${lineIdx + 1}`);
                    console.error(`    Key: ${key}`);
                    console.error(`    Expected ${expected} args, found 0 (or parse error)`);
                    console.error(`    Line: ${line.trim()}\n`);
                    issueCount++;
                }
                // If definition expects args but fewer passed (simple check)
                // Note: argCount heuristic is weak, so we mostly flag 0 vs >0
                else if (expected > argCount) {
                    // Check if it looks like there are args but split failed?
                    // No, mostly flagging "Missing Arguments"
                    console.error(`[!] Potential missing args in ${file}:${lineIdx + 1}`);
                    console.error(`    Key: ${key}`);
                    console.error(`    Expected ${expected} args, found approx ${argCount}`);
                    console.error(`    Line: ${line.trim()}\n`);
                    issueCount++;
                }
            }
        }
    });
});

if (issueCount === 0) {
    console.log('No obvious missing parameters found (heuristic scan).');
} else {
    console.log(`Found ${issueCount} potential issues.`);
}
