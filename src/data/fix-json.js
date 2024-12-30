const fs = require('fs');
const path = require('path');

// Read the original file
const filePath = path.join(__dirname, 'sportsbooks.json');
const outputPath = path.join(__dirname, 'sportsbooks.fixed.json');

try {
    // Read the file as text
    let jsonText = fs.readFileSync(filePath, 'utf8');
    
    // Replace all NaN values with null
    jsonText = jsonText.replace(/: NaN/g, ': null');
    
    // Parse to validate JSON
    const jsonData = JSON.parse(jsonText);
    
    // Write back with proper formatting
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    
    console.log('Successfully fixed JSON file');
} catch (error) {
    console.error('Error processing JSON:', error);
}
