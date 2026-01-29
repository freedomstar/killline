const fs = require('fs');
const path = require('path');

const filesToScan = [
    'js/events.js',
    // 'js/ui.js', // User specifically asked for events.js, but scanning others might be useful later. For now focus on events.js
];

console.log('--- Scanning for Hardcoded I18n Parameters ---');

let issueCount = 0;

filesToScan.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
        // Match I18n.t('key', args...)
        // We catch the whole function call to parse args
        const regex = /I18n\.t\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\)/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
            const key = match[1];
            const argsStr = match[2];

            // Split arguments by comma, but be careful (simple split for now, assuming no commas in strings)
            // A better regex or parser would be needed for complex cases, but this codebase seems simple.
            const args = argsStr.split(',').map(arg => arg.trim());

            args.forEach((arg, argIdx) => {
                // Check if argument is a number literal or string literal
                // Number: /^\d+(\.\d+)?$/
                // String: /^['"].*['"]$/

                const isNumber = /^-?\d+(\.\d+)?$/.test(arg);
                const isString = /^['"].*['"]$/.test(arg);

                if (isNumber || isString) {
                    console.log(`[Line ${lineIdx + 1}] Hardcoded param in ${key}: ${arg}`);
                    console.log(`    Line: ${line.trim()}`);
                    issueCount++;
                }
            });
        }
    });
});

if (issueCount === 0) {
    console.log('No hardcoded parameters found.');
} else {
    console.log(`\nFound ${issueCount} hardcoded parameters.`);
}
