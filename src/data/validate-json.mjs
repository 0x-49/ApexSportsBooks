import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateJson() {
    try {
        const filePath = join(__dirname, 'sportsbooks.fixed.json');
        const jsonText = await readFile(filePath, 'utf8');
        
        // This will throw an error if JSON is invalid
        const jsonData = JSON.parse(jsonText);
        
        console.log('JSON is valid!');
        console.log(`Number of sportsbooks: ${jsonData.length}`);
        
        // Check for any remaining NaN values
        const nanCheck = JSON.stringify(jsonData).includes('NaN');
        if (nanCheck) {
            console.log('Warning: Found NaN values in the JSON');
        } else {
            console.log('No NaN values found - JSON is clean!');
        }
    } catch (error) {
        console.error('Error validating JSON:', error);
    }
}

validateJson();
