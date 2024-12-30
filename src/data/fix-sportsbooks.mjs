import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixJson() {
    try {
        // Read the original file
        const filePath = join(__dirname, 'sportsbooks.json');
        const outputPath = join(__dirname, 'sportsbooks.fixed.json');
        
        // Read the file as text
        const jsonText = await readFile(filePath, 'utf8');
        
        // Replace all NaN values with null
        const fixedText = jsonText.replace(/: NaN/g, ': null');
        
        // Parse to validate JSON
        const jsonData = JSON.parse(fixedText);
        
        // Write back with proper formatting
        await writeFile(outputPath, JSON.stringify(jsonData, null, 2));
        
        console.log('Successfully fixed JSON file');
    } catch (error) {
        console.error('Error processing JSON:', error);
    }
}

fixJson();
