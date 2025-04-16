/**
 * Cleanup script for removing redundant fix-*.js files
 * 
 * Run with: node cleanup-redundant-files.js
 */

const fs = require('fs');
const path = require('path');

// Files to be removed (relative to project root)
const filesToRemove = [
  'fix-activity-indicator-imports.js',
  'fix-activity-indicator-patch.js',
  'fix-activity-indicator.js',
  'fix-all-issues.js',
  'fix-node-modules.js',
  'src/utils/patchDateTimePicker.js',
  'src/utils/stringToNumberPatch.js'
];

console.log('Removing redundant files...');

let removedCount = 0;
let errorCount = 0;

for (const file of filesToRemove) {
  const filePath = path.join(__dirname, file);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${file}`);
      removedCount++;
    } else {
      console.log(`⚠️ Not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${file}: ${error.message}`);
    errorCount++;
  }
}

console.log('\nSummary:');
console.log(`- ${removedCount} files removed`);
console.log(`- ${errorCount} errors encountered`);
console.log('\nThe redundant files have been removed. The consolidated approach is now in place.');
console.log('For more information, please read the STRING_TO_NUMBER_FIX.md file.');
